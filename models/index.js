import user from "./user.js";
import company from "./company.js";
import role from "./role.js";
import project from './project.js';
import document from "./document.js";
import signatureLink from "./signatureLink.js";
import fileInformation from "./fileInformation.js";

user.belongsTo(company, { foreignKey: 'companyId' });
company.hasMany(user, { foreignKey: 'companyId' });

export default {
    company,
    user,
    role,
    project,
    document,
    signatureLink,
    fileInformation
};
