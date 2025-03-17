import mongoose, { Schema, model, models } from 'mongoose';

const CompanySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    device: { type: String, default: '' },
    address: { type: String, default: 'Default Address' },
    tinNumber: { type: String, default: '' },
    phoneNumber: { type: String, default: 'Default Phone' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Use existing model or create a new one
const Company = models.Company || model('Company', CompanySchema);

export default Company;


// name
// email
// device
// tinNumber
// phoneNumber
// street
// city
// address