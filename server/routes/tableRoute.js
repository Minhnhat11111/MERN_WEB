import express from "express";
import { createTable, getAvailableTables} from "../controllers/tableController.js";


const tableRoute = express.Router();

tableRoute.post("/create", createTable)
tableRoute.get("/get", getAvailableTables)


export default tableRoute;
