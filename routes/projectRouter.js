import { controller } from "./../controllers/projetController";

const router = Router();


router.post("/project",
            passport.authenticate("jwt", {session: false}),
            controller.createProject
)

export default router;