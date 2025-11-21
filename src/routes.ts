import { Router } from "express";
import * as Controllers from "./controllers";

const router = Router();

router.post("/user", Controllers.loginUser);
router.get("/user/name/:name", Controllers.getUserByName);

router.get("/registros/date/:date", Controllers.getRegistros);
router.post("/registros/entrada", Controllers.createEntrada);
router.post("/registros/gasto_fixo", Controllers.createGastoFixo);
router.post("/registros/gasto_variavel", Controllers.createGastoVariavel);
router.put("/registros/gasto_fixo", Controllers.updateGastoFixo);
router.delete("/registros/id/:id", Controllers.deleteRegistro);

router.get("/meta/date/:date", Controllers.getMeta);
router.post("/meta", Controllers.createMeta); 
router.put("/meta", Controllers.updateMeta);

export default router;