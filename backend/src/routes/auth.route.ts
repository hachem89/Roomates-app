import { Request, Response, Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, loginController, registerUserController } from "../controllers/auth.controller";
import requireJwtAuth from "../middlewares/requireJwtAuth.middleware";
import requireLocalAuth from "../middlewares/requireLocalAuth.middleware";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register",registerUserController)
authRoutes.post("/login", requireLocalAuth ,loginController)

authRoutes.get("/currentUser",requireJwtAuth,async(req:Request,res:Response)=>{
  const currentUser = req.user
  res.json({currentUser})
})

// authRoutes.get("/:userId",requireJwtAuth, async(req:Request, res:Response)=>{
//   const userId = req.params.userId
//   const user = await UserModel.findById(userId)
//   if(!user) throw new NotFoundException("User not found")
//     res.json({user})
// })

// authRoutes.get("/house/:houseId",requireJwtAuth, async(req:Request,res:Response)=>{
//   const house = await HouseModel.findById(req.params.houseId)
//   res.json({house})
// })

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
    session: false,
  }),
  googleLoginCallback
);

export default authRoutes;
