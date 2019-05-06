const express = require("express");
const testController = require("./testController");

const router = express.Router();


/*
 * 
 *  Rutas del API
 * 
 */
router.post('/match', testController.getMatch);



module.exports = router;