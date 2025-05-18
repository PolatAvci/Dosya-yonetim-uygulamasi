export class FileRecord {
  constructor(id, name, description, uploadDate, filePath) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.uploadDate = uploadDate;
    this.filePath = filePath;
  }

  static fromJson(json) {
    return new FileRecord(
      json.id,
      json.name,
      json.description,
      json.uploadDate,
      json.filePath
    );
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      uploadDate: this.uploadDate,
      filePath: this.filePath,
    };
  }
}
