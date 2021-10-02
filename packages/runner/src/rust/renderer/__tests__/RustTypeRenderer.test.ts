import { RustTypeRenderer } from "../RustTypeRenderer";
import { typeMatrix } from "./utils";

describe("RustTypeRenderer", () => {
  it("can render all types", () => {
    const renderedTypes = typeMatrix
      .map((type) => type.render(new RustTypeRenderer()))
      .join("\n");
    expect(renderedTypes).toMatchSnapshot();
  });
});
