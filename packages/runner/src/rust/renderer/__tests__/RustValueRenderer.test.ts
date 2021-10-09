import { RustValueRenderer } from "../RustValueRenderer";
import { typeMatrix } from "./utils";

describe("RustValueRenderer", () => {
  it("can render all values", () => {
    const renderedTypes = typeMatrix
      .map((type) => type.render(new RustValueRenderer()))
      .join("\n");
    expect(renderedTypes).toMatchSnapshot();
  });
});
