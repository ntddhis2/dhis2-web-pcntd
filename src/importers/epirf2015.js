module.exports = function(_params) {

  let moment = require('moment');

  console.log(_params.period)

  let params = Object.assign({
    period: null,
    orgUnits: null,
    orgTree: null,
    geoconnectAttributeID: 'rct9QrdQEnz',
    spellingsAttributeID: 'U4FWYMGCWju',
    lfProgram: "pcn-lfsurvey-event",
    // lfProgramStage: "jrgpfrJKSW0",
    onchoProgram: "pcn-ovsurvey-event",
    // onchoProgramStage: "f1QqINpgrcR",
    sthProgram: "pcn-sthsurvey-event",
    schProgram: "pcn-schsurvey-event",
    rootOrgName: 'Ethiopia',
    attributeOptionCombo: "default",
    attributeCategoryOptions: "default"
  }, _params);

  var def = {
    params: params,

    sheets: [

      // LF Sheet
      {
        names: [/LF/],
        startRow: 17,
        params: params,
        row: {
          event: {
          //   event: function(row) {
          //     var district = getRowVariables(row)['district'];
          //     if (!district) district = "0"
          //     var date = getRowVariables(row)['surveydate'];
          //     if (!date) {
          //       date = moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
          //     }
          //     return params.lfProgram + "-" + district.id + "-" + date;
          //   },
            program: params.lfProgram,
            programStage: params.lfProgramStage,
            attributeOptionCombo: params.attributeOptionCombo,
            attributeCategoryOptions: params.attributeCategoryOptions,
            status: "COMPLETED",
            eventDate: function(row) {
              var date = getRowVariables(row)['surveydate'];
              if (!date) {
                return moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
              } else {
                return date;
              }
            },
            orgUnit: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.id;
            },
            orgUnitName: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.name;
            },
            coordinate: function(row) {
              var lat = getRowVariables(row)['latitude'];
              var lon = getRowVariables(row)['longitude'];
              if (lat && lon) {
                return {
                  latitude: lat,
                  longitude: lon
                }
              }
            },
            notes: function(row) {
              var comments = getRowVariables(row)['comments'];
              if (comments) {
                return [{value: comments}]
              }
            },
          },
          invariants: {

          },
          dataValues: [
            // Type of survey
            {
              column: "D",
              dataElement: "lf-survey-type",
              mapping: function(value, row) {
                if (value == "Mapping") {
                  return "mapping";
                } else if (value == "Sentinel site") {
                  return "sentinel";
                } else if (value == "Spot check") {
                  return "spotcheck";
                } else if (value == "TAS1") {
                  return "tas1";
                } else if (value == "Repeated TAS1") {
                  return "tas1-repeated";
                } else if (value == "TAS2") {
                  return "tas2";
                } else if (value == "TAS3") {
                  return "tas3";
                } else if (value == "Clinical case estimation") {
                  return "cce";
                }
              }
            },
            // Name of survey site
            {
              column: "C",
              dataElement: "pcn-site-name",
            },
            // Name of administrative (implementation) unit
            {
              column: "B",
              variable: "district",
              mapping: function(value, row) {
                return getDistrict(value);
              }
            },
            // Date of Survey
            {
              column: "E",
              variable: "surveydate",
              mapping: function(value, row) {
                var d = moment(value, 'MMMM YYYY', true);
                if (!d || !d.isValid()) 
                  d = moment(value + ' ' + params.period, 'MMMM YYYY' );
                return d.format('YYYY-MM-DD');
              }
            },
            // Latitude
            { 
              column: "F",
              variable: "latitude"
            },
            // Longitude
            { 
              column: "G",
              variable: "longitude"
            },
            // Date of the first PC round
            {
              column: "H",
              dataElement: "pcn-first-round-date",
              mapping: function(value, row) {
                if (value) {
                  return moment(value).format('YYYY-MM-DD');
                }
              }
            },
            // Number of rounds of PC delivered prior to survey
            {
              column: "I",
              dataElement: "pcn-num-rounds-pre-survey",
              mapping: function(value, row) {
                if (value) {
                  return parseInt(value, 10);
                }
              }
            },
            // Diagnostic Test
            {
              column: "M",
              dataElement: "lf-diagnostic-test",
              mapping: function(value, row) {
                if (value === "Blood film/counting chamber (mf)") {
                  return "blood-cc-mf";
                } else if (value === "FTS (Ag)") {
                  return "fts-ag";
                } else if (value === "ICT (Ag)") {
                  return "ict-ag";
                } else if (value === "Brugia Rapid (Ab)") {
                  return "brugia-rapid";
                } else if (value === "FTS/ICT + Brugia Rapid") {
                  return "ftsict-brugia";
                } else if (value === "Other") {
                  return "other";
                }
              }
            },
            // Age - Minimum
            {
              column: "N",
              dataElement: "pcn-min-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[1]) return parseInt(match[1],10)
              }
            },
            // Age - Maximum
            {
              column: "N",
              dataElement: "pcn-max-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[2]) return parseInt(match[2],10)
              }
            },
            // Survey Site Type
            {
              column: "P",
              dataElemeOt: "lf-site-type",
              mapping: function(value, row) {
                if (value === "School") {
                  return "school";
                } else if (value === "Community") {
                  return "community";
                }
              }
            },
            // Survey Methodology 
            // {
            //   column: "M",
            //   dataElement: "lf-survey-method",
            //   mapping: function(value, row) {
            //     if (value === "Cluster") {
            //       return "cluster";
            //     } else if (value === "Systematic") {
            //       return "systematic";
            //     } else if (value === "Census") {
            //       return "census";
            //     } else if (value === "Convenience") {
            //       return "convenience";
            //     }
            //   }
            // },
            // Target sample size
            {
              column: "R",
              dataElement: "pcn-target-sample-size",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Number of people examined
            {
              column: "S",
              dataElement: "pcn-num-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Number of people positive
            {
              column: "T",
              dataElement: "pcn-num-positive",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Number of invalid tests
            {
              column: "V",
              dataElement: "pcn-num-invalid-tests",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // LF Decision
            {
              column: "X",
              dataElement: "lf-decision",
              mapping: function(value, row) {
                if (value === "Start PC") {
                  return "start-pc";
                } else if (value === "Continue PC") {
                  return "continue-pc";
                } else if (value === "Stop PC") {
                  return "stop-pc";
                } else if (value === "Restart PC") {
                  return "restart-pc";
                } else if (value === "Continue surveillance") {
                  return "continue-surveillance";
                }
              }
            },
            // LF - Number of Patients (Lymphoedema)
            {
              column: "Y",
              dataElement: "lf-lym-num-patients",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // // LF - Method of Patient Estimation (Lymphoedema)
            // {
            //   column: "U",
            //   dataElement: "lf-lym-patients-est-method",
            //   mapping: function(value, row) {
            //     return value;
            //   }
            // },
            // // LF - Date of Patient Estimation (Lymphoedema) 
            // {
            //   column: "V",
            //   dataElement: "lf-lym-patients-est-date",
            //   mapping: function(value, row) {
            //     if (value) {
            //       var matches = value.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
            //       if (matches && matches.length > 0) {
            //         return moment(matches[0],'MM-DD-YYYY').format('YYYY-MM-DD');
            //       }
            //     }
            //   }
            // },
            // LF - Number of Health Facilities (Lymphoedema) 
            {
              column: "AA",
              dataElement: "lf-lym-service-facilities",
              mapping: function(value, row) {
                return value;
              }
            },
            // LF - Number of Patients (Hydrocele)
            {
              column: "AB",
              dataElement: "lf-hc-num-patients",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // // LF - Method of Patient Estimation (Lymphoedema)
            // {
            //   column: "Y",
            //   dataElement: "lf-hc-patients-est-method",
            //   mapping: function(value, row) {
            //     return value;
            //   }
            // },
            // // LF - Date of Patient Estimation (Lymphoedema) 
            // {
            //   column: "Z",
            //   dataElement: "lf-hc-patients-est-date",
            //   mapping: function(value, row) {
            //     if (value) {
            //       var matches = value.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
            //       if (matches && matches.length > 0) {
            //         return moment(matches[0],'MM-DD-YYYY').format('YYYY-MM-DD');
            //       }
            //     }
            //   }
            // },
            // LF - Number of Health Facilities (Hydrocele) 
            {
              column: "AD",
              dataElement: "lf-hc-service-facilities",
              mapping: function(value, row) {
                return value;
              }
            },
            // Comments
            { 
              column: "AE",
              variable: "comments"
            }
          ]
        }
      },

      // Oncho Sheet
      {
        names: [/ONCHO/],
        startRow: 8,
        params: params,
        row: {
          event: {
            // event: function(row) {
            //   var district = getRowVariables(row)['district'];
            //   if (!district) district = "0"
            //   var date = getRowVariables(row)['dateOfSurvey'];
            //   if (!date) {
            //     date = moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
            //   }
            //   return params.onchoProgram + "-" + district.id + "-" + date;
            // },
            program: params.onchoProgram,
            programStage: params.onchoProgramStage,
            attributeOptionCombo: params.attributeOptionCombo,
            attributeCategoryOptions: params.attributeCategoryOptions,
            status: "COMPLETED",
            eventDate: function(row) {
              var date = getRowVariables(row)['dateOfSurvey'];
              if (!date) {
                return moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
              } else {
                return date;
              }
            },
            orgUnit: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.id;
            },
            orgUnitName: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.name;
            },
            coordinate: function(row) {
              var lat = getRowVariables(row)['latitude'];
              var lon = getRowVariables(row)['longitude'];
              if (lat && lon) {
                return {
                  latitude: lat,
                  longitude: lon
                }
              }
            },
            notes: function(row) {
              var comments = getRowVariables(row)['comments'];
              if (comments) {
                return [{value: comments}]
              }
            },
          },
          invariants: {

          },
          dataValues: [
            // Type of survey
            {
              column: "F",
              dataElement: "ov-survey-type",
              mapping: function(value, row) {
                if (value) {
                  if (value.match(/map/i)) {
                    return "mapping";
                  } else if (value.match(/1a/i)) {
                    return "phase1a";
                  } else if (value.match(/1b/i)) {
                    return "phase1b";
                  } else if (value.match(/pts/i)) {
                    return "pts";
                  }
                }
              }
            },
            // Admin
            {
              column: "A",
              variable: "district",
              mapping: function(value, row) {
                return getDistrict(value);
              }
            },
            // Community Surveyed 
            {
              column: "D",
              dataElement: "pcn-community",
            },
            // Date of survey
            {
              column: "C",
              variable: "dateOfSurvey",
              mapping: function(value, row) {
                var d = moment(value, 'MMMM YYYY', true);
                if (!d || !d.isValid()) 
                  d = moment(value + ' ' + params.period, 'MMMM YYYY');
                return d.format('YYYY-MM-DD');
              }
            },
            // Latitude
            { 
              column: "D",
              variable: "latitude"
            },
            // Longitude
            { 
              column: "E",
              variable: "longitude"
            },

            // MF Skin Snip
            // Diagnostic Method
            {
              column: "G",
              dataElement: "ov-mf-skin-diag-method",
              mapping: function(value, row) {
                if (value === "Microscopy") {
                  return "microscopy";
                } else if (value === "PCR") {
                  return "pcr";
                }
              }
            },
            // Number People Examined
            {
              column: "H",
              dataElement: "ov-mf-skin-num-people-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Number People Positive
            {
              column: "I",
              dataElement: "ov-mf-skin-num-people-pos",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },

            // Serology
            // Number People Examined
            {
              column: "K",
              dataElement: "ov-serology-num-people-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // Number People Positive
            {
              column: "L",
              dataElement: "ov-serology-num-people-pos",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },

            // PCR in black flies
            // # Flies Examined
            {
              column: "N",
              dataElement: "ov-pcr-num-flies-examined",
              mapping: function(value, row) {
                if (value) return parseInt(value, 10);
              }
            },
            // % Poolscreen positive
            {
              column: "O",
              dataElement: "ov-pct-poolscreen-pos",
              mapping: function(value, row) {
                if (value) return parseFloat(value);
              }
            }
          ]
        }
      },

      // STH Sheet
      {
        names: [/STH/],
        startRow: 8,
        params: params,
        row: {
          event: {
            program: params.sthProgram,
            attributeOptionCombo: params.attributeOptionCombo,
            attributeCategoryOptions: params.attributeCategoryOptions,
            status: "COMPLETED",
            eventDate: function(row) {
              var date = getRowVariables(row)['surveydate'];
              if (!date) {
                return moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
              } else {
                return date;
              }
            },
            orgUnit: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.id;
            },
            orgUnitName: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.name;
            },
            coordinate: function(row) {
              var lat = getRowVariables(row)['latitude'];
              var lon = getRowVariables(row)['longitude'];
              if (lat && lon) {
                return {
                  latitude: lat,
                  longitude: lon
                }
              }
            },
            notes: function(row) {
              var comments = getRowVariables(row)['comments'];
              if (comments) {
                return [{value: comments}]
              }
            },
          },
          invariants: {

          },
          dataValues: [
            // Type of survey - not in 2015
            // {
            //   column: "A",
            //   dataElement: "sth-survey-type",
            //   mapping: function(value, row) {
            //     if (value == "Mapping") {
            //       return "mapping";
            //     } else if (value == "Sentinel site") {
            //       return "sentinel";
            //     } else if (value == "With TAS") {
            //       return "withtas";
            //     } else if (value == "Other") {
            //       return "other";
            //     }
            //   }
            // },
            // Name of administrative (implementation) unit
            {
              column: "A",
              variable: "district",
              mapping: function(value, row) {
                return getDistrict(value);
              }
            },
            // Date of Survey
            {
              column: "C",
              variable: "surveydate",
              mapping: function(value, row) {
                var d = moment(value, 'MMMM YYYY', true);
                if (!d || !d.isValid()) 
                  d = moment(value + ' ' + params.period, 'MMMM YYYY' );
                return d.format('YYYY-MM-DD');
              }
            },
            // Latitude
            { 
              column: "D",
              variable: "latitude"
            },
            // Longitude
            { 
              column: "E",
              variable: "longitude"
            },
            // Age - Minimum
            {
              column: "G",
              dataElement: "pcn-min-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[1]) return parseInt(match[1],10)
              }
            },
            // Age - Maximum
            {
              column: "G",
              dataElement: "pcn-max-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[2]) return parseInt(match[2],10)
              }
            },
            // Ascaris - Number People Examined
            {
              column: "H",
              dataElement: "sth-ascaris-num-people-examined",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // Ascaris - Number People Positive
            {
              column: "I",
              dataElement: "sth-ascaris-num-people-pos",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // Ascaris - % Moderate Infection
            {
              column: "L",
              dataElement: "sth-ascaris-pct-moderate-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            },
            // Ascaris - % Heavy Infection
            {
              column: "K",
              dataElement: "sth-ascaris-pct-heavy-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            },

            // Hookworm - Number People Examined
            {
              column: "M",
              dataElement: "sth-hookworm-num-people-examined",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // Hookworm - Number People Positive
            {
              column: "N",
              dataElement: "sth-hookworm-num-people-pos",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // Hookworm - % Moderate Infection
            {
              column: "Q",
              dataElement: "sth-hookworm-pct-moderate-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            },
            // Hookworm - % Heavy Infection
            {
              column: "P",
              dataElement: "sth-hookworm-pct-heavy-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            },

            // Trichuris - Number People Examined
            {
              column: "R",
              dataElement: "sth-trichuris-num-people-examined",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // Trichuris - Number People Positive
            {
              column: "S",
              dataElement: "sth-trichuris-num-people-pos",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // Trichuris - % Moderate Infection
            {
              column: "V",
              dataElement: "sth-trichuris-pct-moderate-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            },
            // Trichuris - % Heavy Infection
            {
              column: "U",
              dataElement: "sth-trichuris-pct-heavy-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            }
          ]
        }
      },

      // SCH Sheet
      {
        names: [/SCH/],
        startRow: 8,
        params: params,
        row: {
          event: {
            program: params.schProgram,
            attributeOptionCombo: params.attributeOptionCombo,
            attributeCategoryOptions: params.attributeCategoryOptions,
            status: "COMPLETED",
            eventDate: function(row) {
              var date = getRowVariables(row)['surveydate'];
              if (!date) {
                return moment(new Date(params.period,0,1)).format('YYYY-MM-DD');
              } else {
                return date;
              }
            },
            orgUnit: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.id;
            },
            orgUnitName: function(row) {
              var district = getRowVariables(row)['district'];
              if (district) return district.name;
            },
            coordinate: function(row) {
              var lat = getRowVariables(row)['latitude'];
              var lon = getRowVariables(row)['longitude'];
              if (lat && lon) {
                return {
                  latitude: lat,
                  longitude: lon
                }
              }
            },
            notes: function(row) {
              var comments = getRowVariables(row)['comments'];
              if (comments) {
                return [{value: comments}]
              }
            },
          },
          invariants: {

          },
          dataValues: [
            // Name of administrative (implementation) unit
            {
              column: "A",
              variable: "district",
              mapping: function(value, row) {
                return getDistrict(value);
              }
            },
            // Date of Survey
            {
              column: "C",
              variable: "surveydate",
              mapping: function(value, row) {
                var d = moment(value, 'MMMM YYYY', true);
                if (!d || !d.isValid()) 
                  d = moment(value + ' ' + params.period, 'MMMM YYYY' );
                return d.format('YYYY-MM-DD');
              }
            },
            // Latitude
            { 
              column: "D",
              variable: "latitude"
            },
            // Longitude
            { 
              column: "E",
              variable: "longitude"
            },
            // Age - Minimum
            {
              column: "G",
              dataElement: "pcn-min-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[1]) return parseInt(match[1],10)
              }
            },
            // Age - Maximum
            {
              column: "G",
              dataElement: "pcn-max-age",
              mapping: function(value, row) {
                var match = /(\d{2})(\d{2})/.exec(value);
                if (match && match[2]) return parseInt(match[2],10)
              }
            },
            // SCH - Urinary - Number People Examined
            {
              column: "H",
              dataElement: "sch-urn-num-people-examined",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // SCH - Urinary - Number People Positive
            {
              column: "I",
              dataElement: "sch-urn-num-people-pos",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // SCH - Urinary - % Low Infection
            {
              column: "L",
              dataElement: "sch-urn-pct-moderate-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            },
            // SCH - Urinary - % Heavy Infection
            {
              column: "K",
              dataElement: "sch-urn-pct-heavy-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            },
            // SCH - Intestinal - Number People Examined
            {
              column: "M",
              dataElement: "sch-intestinal-num-people-examined",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // SCH - Intestinal - Number People Positive
            {
              column: "N",
              dataElement: "sch-intestinal-num-people-pos",
              mapping: function(value) {
                return parseInt(value, 10);
              }
            },
            // SCH - Intestinal - % Low Infection
            {
              column: "Q",
              dataElement: "sch-intestinal-pct-moderate-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            },
            // SCH - Intestinal - % Heavy Infection
            {
              column: "P",
              dataElement: "sch-intestinal-pct-heavy-infection",
              mapping: function(value) {
                return parseFloat(value);
              }
            }
          ]
        }
      }
    ]
  };


  function getRowVariables(row) {
    var variables = {};
    for (var i = 0; i < row.length; i++) {
      if (row[i].variable) variables[row[i].variable] = row[i].value;
    }
    return variables;
  }

  function getRowDataElements(row) {
    var elements = {};
    for (var i = 0; i < row.length; i++) {
      if (row[i].dataElement) elements[row[i].dataElement] = row[i].value;
    }
    return elements;
  }

  function getDistrict(districtName) {
    for (var r = 0; r < params.orgTree.children.length; r++) {
      var region = params.orgTree.children[r];
      for (var z = 0; z < region.children.length; z++) {
        var zone = region.children[z];
        for (var w = 0; w < zone.children.length; w++) {
          var woreda = zone.children[w];
          for (var s = 0; s < woreda.spellings.length; s++) {
            if (woreda.spellings[s].toLowerCase().trim() === districtName.toLowerCase().trim()) {
              return woreda;
            }
          }
        }
      }
    }
    console.log("Unable to find district named '" + districtName + "'");
  }

  return def;

}