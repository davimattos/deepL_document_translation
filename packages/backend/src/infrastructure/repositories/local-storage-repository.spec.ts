import fs from "fs";
import path from "path";
import { LocalStorageRepository } from "./local-storage-repository";

jest.mock("fs");

describe("LocalStorageRepository", () => {
  let repo: LocalStorageRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    repo = new LocalStorageRepository();
  });

  it("should create downloads and uploads directories if they do not exist", () => {
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining("downloads"));
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining("uploads"));

    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining("downloads"), { recursive: true });
    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining("uploads"), { recursive: true });
  });

  it("should return correct download path", () => {
    const filename = "example.pdf";
    const result = repo.getDownloadPath(filename);
    expect(result).toBe(path.join(path.resolve("downloads"), filename));
  });

  it("should return true if file exists", () => {
    const filePath = "/fake/file.txt";
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    expect(repo.fileExists(filePath)).toBe(true);
    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
  });

  it("should delete file if it exists", () => {
    const filePath = "/fake/file.txt";
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

    repo.deleteTempFile(filePath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
  });

  it("should return multer instance from getUploadMiddleware", () => {
    const middleware = repo.getUploadMiddleware();
    expect(typeof middleware).toBe("object");
    expect(middleware).toHaveProperty("single");
    expect(middleware).toHaveProperty("array");
  });
});
