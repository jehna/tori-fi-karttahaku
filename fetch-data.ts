import fs from "fs/promises";

if (await fs.stat("src/data.json").catch(() => false)) {
  console.log("Data already exists");
  process.exit(0);
}

// Check https://mikaelahonen.com/fi/data/postinumero-data-suomi/
const data = await fetch(
  "https://storage.googleapis.com/mikaelahonen_com_public/finland-postal-codes-with-polygons.json"
).then((res) => res.json());

const areas: {
  polygon: [number, number][][];
  postinumeroalue: string;
  nimi: string;
}[] = (data as any).map(
  ({
    multi_polygon,
    postinumeroalue,
    nimi,
  }: {
    multi_polygon: string;
    postinumeroalue: string;
    nimi: string;
  }) => {
    const locations = /^MULTIPOLYGON \(\(\((?<locations>.+)\)\)\)$/.exec(
      multi_polygon
    )?.groups?.locations;
    if (!locations) {
      throw new Error("Invalid multi_polygon");
    }
    const polygon = locations
      .split(")), ((")
      .map(
        (polygon) =>
          polygon
            .split(", ")
            .map((point) => point.split(" ").map(Number).reverse()) as [
            number,
            number
          ][]
      );
    return { polygon, postinumeroalue, nimi };
  }
);

await fs.writeFile("src/data.json", JSON.stringify(areas), "utf-8");
