import auth from "./auth.js";
import user from "./userRouter.js";
import company from "./companyRouter.js";
import role from "./roleRouter.js";
import document from "./documentRouter.js";
import fileInformations from "./fileInformationsRouter.js";
import project from "./projectRouter.js";

export default {
  auth,
  user,
  company,
  document,
  role,
  fileInformations,
  project,
};
