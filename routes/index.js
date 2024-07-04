import auth from "./auth.js";
import user from "./userRouter.js";
import company from "./companyRouter.js";
import role from "./roleRouter.js";
import document from "./documentRouter.js";
import fileInformations from "./fileInformationsRouter.js";
import project from "./projectRouter.js";
import messsage from "./messageRouter.js";
import i18n from "./i18n.js";

export default {
  i18n,
  auth,
  user,
  company,
  document,
  role,
  fileInformations,
  project,
  messsage
};
