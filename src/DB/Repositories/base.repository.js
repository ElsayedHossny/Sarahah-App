/**
 * ===================== Create Document ==================
 * create
 * insertMany
 * save
 * ===================== Read Document ==================
 * find
 * findOne
 * findById
 * ===================== Update Document ==================
 * updateOne
 * findOneAndUpdate
 * findByIdAndUpdate
 * save
 * ** updateMany
 * ===================== Delete Document ==================
 * deleteOne
 * findOneAnddelete
 * findByIdAnddelete
 * ** deleteMany
 */

export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  // CREATE
  createOneDocument(data) {
    return this.model.create(data);
  }
  createManyDocument(arraydata) {
    return this.model.insertMany(arraydata);
  }

  // READ
  findDocumentById(_id) {
    return this.model.findById(_id);
  }

  findOneDocument(filters = {}) {
    return this.model.findOne(filters);
  }

  findAllDocuments(filters = {}) {
    return this.model.find(filters);
  }

  // UPDATE
  findOneAndUpdateDocument(filters, updates, options = {}) {
    return this.model.findOneAndUpdate(filters, updates, options);
  }

  findByIdAndUpdateDocument(_id, updates, options = {}) {
    return this.model.findByIdAndUpdate(_id, updates, options);
  }

  // DELETE
  findOneAndDeleteDocument(filters) {
    return this.model.findOneAndDelete(filters);
  }

  findByIdAndDeleteDocument(_id) {
    return this.model.findByIdAndDelete(_id);
  }
  s;
}
