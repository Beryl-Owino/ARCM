var express = require("express");
var JudicialReview = express();
var mysql = require("mysql");
var config = require("./../../DB");
var Joi = require("joi");
var con = mysql.createPool(config);
var auth = require("./../../auth");
JudicialReview.get("/", auth.validateRole("Judicial Review"), function(
  req,
  res
) {
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call GetJudicialreviewApplications()";
      connection.query(sp, [res.locals.user], function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
JudicialReview.get("/:ID", auth.validateRole("Judicial Review"), function(
  req,
  res
) {
  const ID = req.params.ID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call Getjudicialreviewdocuments(?)";
      connection.query(sp, [ID], function(error, results, fields) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json(results[0]);
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
JudicialReview.get(
  "/:ID/:Details",
  auth.validateRole("Judicial Review"),
  function(req, res) {
    const ID = req.params.ID;
    con.getConnection(function(err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      } // not connected!
      else {
        let sp = "call getJudicialReviewDetails(?)";
        connection.query(sp, [ID], function(error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            res.json(results[0]);
          }
          connection.release();
          // Don't use the connection here, it has been returned to the pool.
        });
      }
    });
  }
);
JudicialReview.get(
  "/:ID/:Applications/:Cloased",
  auth.validateRole("Judicial Review"),
  function(req, res) {
    const ID = req.params.ID;
    con.getConnection(function(err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      } // not connected!
      else {
        if (ID == "SubmitedDecisions") {
          let sp = "call GetAllSubmitedDecisions()";
          connection.query(sp, function(error, results, fields) {
            if (error) {
              res.json({
                success: false,
                message: error.message
              });
            } else {
              res.json(results[0]);
            }
            connection.release();
            // Don't use the connection here, it has been returned to the pool.
          });
        } else {
          let sp = "call GetClosedApplicationsForDecisionUploads()";
          connection.query(sp, function(error, results, fields) {
            if (error) {
              res.json({
                success: false,
                message: error.message
              });
            } else {
              res.json(results[0]);
            }
            connection.release();
            // Don't use the connection here, it has been returned to the pool.
          });
        }
      }
    });
  }
);
JudicialReview.post("/", auth.validateRole("Judicial Review"), function(
  req,
  res
) {
  const schema = Joi.object().keys({
    ApplicationNo: Joi.string().required(),
    DateFilled: Joi.date().required(),
    CaseNO: Joi.string().required(),
    Description: Joi.string().required(),
    Applicant: Joi.string().required(),
    Court: Joi.string().required(),
    Town: Joi.string().required()
  });
  const result = Joi.validate(req.body, schema);
  if (!result.error) {
    let data = [
      req.body.ApplicationNo,
      req.body.DateFilled,
      req.body.CaseNO,
      req.body.Description,
      req.body.Applicant,
      req.body.Court,
      req.body.Town,
      res.locals.user
    ];

    con.getConnection(function(err, connection) {
      if (err) {
        res.json({
          success: false,
          message: err.message
        });
      } // not connected!
      else {
        let sp = "call Savejudicialreview(?,?,?,?,?,?,?,?)";
        connection.query(sp, data, function(error, results, fields) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            res.json({
              success: true,
              message: "saved"
            });
          }
          connection.release();
          // Don't use the connection here, it has been returned to the pool.
        });
      }
    });
  } else {
    res.json({
      success: false,
      message: result.error.details[0].message
    });
  }
});
JudicialReview.post(
  "/:Documents",
  auth.validateRole("Judicial Review"),
  function(req, res) {
    const schema = Joi.object().keys({
      ApplicationNo: Joi.string().required(),
      Name: Joi.string().required(),
      Path: Joi.string().required(),
      Description: Joi.string().required()
    });
    const result = Joi.validate(req.body, schema);
    if (!result.error) {
      let data = [
        req.body.ApplicationNo,
        req.body.Name,
        req.body.Description,
        req.body.Path,
        res.locals.user
      ];

      con.getConnection(function(err, connection) {
        if (err) {
          res.json({
            success: false,
            message: err.message
          });
        } // not connected!
        else {
          let sp = "call Savejudicialreviewdocuments(?,?,?,?,?)";
          connection.query(sp, data, function(error, results, fields) {
            if (error) {
              res.json({
                success: false,
                message: error.message
              });
            } else {
              res.json({
                success: true,
                message: "saved"
              });
            }
            connection.release();
            // Don't use the connection here, it has been returned to the pool.
          });
        }
      });
    } else {
      res.json({
        success: false,
        message: result.error.details[0].message
      });
    }
  }
);
JudicialReview.delete("/:ID", auth.validateRole("Judicial Review"), function(
  req,
  res
) {
  const ID = req.params.ID;
  con.getConnection(function(err, connection) {
    if (err) {
      res.json({
        success: false,
        message: err.message
      });
    } // not connected!
    else {
      let sp = "call DeleteJudicialDocument(?,?)";
      connection.query(sp, [ID, res.locals.user], function(
        error,
        results,
        fields
      ) {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          res.json({
            success: true,
            message: "Deleted"
          });
        }
        connection.release();
        // Don't use the connection here, it has been returned to the pool.
      });
    }
  });
});
module.exports = JudicialReview;
