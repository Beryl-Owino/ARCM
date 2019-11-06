import React, { Component } from "react";
import swal from "sweetalert";
import Table from "../../Table";
import TableWrapper from "../../TableWrapper";
import { Link } from "react-router-dom";
import { Progress } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ReactHtmlParser from "react-html-parser";
import Modal from "react-awesome-modal";
import CKEditor from "ckeditor4-react";
import Select from "react-select";
var _ = require("lodash");
var dateFormat = require("dateformat");
class DecisionPreparations extends Component {
  constructor() {
    super();
    this.state = {
      Documents: [],
      Applications: [],
      Findings: [],
      TenderName: "",
      ApplicantDetails: [],
      privilages: [],
      Confidential: false,
      ApplicationNo: "",
      PEDetails: [],
      summary: false,
      open: false,
      Orders: false,
      Decisionorders: [],
      Issues: [],
      FollowUpRequired: false,
      RefertoDG: false,
      Closed: false,
      DecisionDate: "",
      selectedFile: null,
      loaded: 0,
      IsUpdateFindings: false,
      Description: "",
      IsUpdateissues: false,
      openViewer: false,
      openIssuesModal: false,
      openFindingsModal: false,
      loaded: 0,
      Number: "",
      Action: "",
      FilingDate: "",
      AwardDate: "",
      TenderNo: "",
      TenderValue: "",
      TenderCategory: "",
      TenderSubCategory: "",
      TenderType: "",
      openBackgroundsModal: false,
      BackgroundInformation: ""
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.HandlePrevieView = this.HandlePrevieView.bind(this);
  }
  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  fetchPEDetails = ApplicationNo => {
    this.setState({ PEDetails: [] });
    fetch("/api/PE/" + ApplicationNo + "/ApplicantDetails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(PEDetails => {
        if (PEDetails.length > 0) {
          this.setState({ PEDetails: PEDetails });
        } else {
          swal("", PEDetails.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };

  fetchOrders = ApplicationNo => {
    this.setState({ Decisionorders: [] });
    fetch("/api/decisionorders/" + ApplicationNo, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(PEDetails => {
        if (PEDetails.length > 0) {
          this.setState({ Decisionorders: PEDetails });
        } else {
          swal("", PEDetails.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchIssues = ApplicationNo => {
    this.setState({ Issues: [] });
    fetch("/api/issuesfordetermination/" + ApplicationNo, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(PEDetails => {
        if (PEDetails.length > 0) {
          this.setState({ Issues: PEDetails });
        } else {
          swal("", PEDetails.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchFindings = ApplicationNo => {
    this.setState({ Findings: [] });
    fetch("/api/findingsonissues/" + ApplicationNo, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(PEDetails => {
        if (PEDetails.length > 0) {
          this.setState({ Findings: PEDetails });
        } else {
          swal("", PEDetails.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchDocuments = ApplicationNo => {
    this.setState({ Documents: [] });
    fetch("/api/decisiondocuments/" + ApplicationNo, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(PEDetails => {
        if (PEDetails.length > 0) {
          this.setState({ Documents: PEDetails });
        } else {
          swal("", PEDetails.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchApplicantDetails = ApplicationNo => {
    this.setState({ ApplicantDetails: [] });
    fetch("/api/Panels/" + ApplicationNo + "/ApplicantDetails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(ApplicantDetails => {
        if (ApplicantDetails.length > 0) {
          this.setState({ ApplicantDetails: ApplicantDetails });
        } else {
          swal("", ApplicantDetails.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  fetchBackgroundInformation = ApplicationNo => {
    this.setState({ BackgroundInformation: "" });
    fetch("/api/Decision/" + ApplicationNo, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(ApplicantDetails => {
        if (ApplicantDetails.length > 0) {
          this.setState({
            BackgroundInformation: ApplicantDetails[0].Backgroundinformation
          });
        } else {
          swal("", ApplicantDetails.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  handleSelectChange = (UserGroup, actionMeta) => {
    this.setState({ [actionMeta.name]: UserGroup.value });
  };
  handleInputChange = event => {
    // event.preventDefault();
    // this.setState({ [event.target.name]: event.target.value });
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  fetchApplications = () => {
      this.setState({ Applications: [] });
    fetch("/api/HearingInProgress", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(Applications => {
        if (Applications.length > 0) {
          this.setState({ Applications: Applications });
        } else {
          swal("", Applications.message, "error");
        }
      })
      .catch(err => {
        swal("", err.message, "error");
      });
  };
  componentDidMount() {
    let token = localStorage.getItem("token");
    if (token == null) {
      localStorage.clear();
      return (window.location = "/#/Logout");
    } else {
      fetch("/api/ValidateTokenExpiry", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        }
      })
        .then(response =>
          response.json().then(data => {
            if (data.success) {
              this.fetchApplications();
              this.ProtectRoute();
            } else {
              localStorage.clear();
              return (window.location = "/#/Logout");
            }
          })
        )
        .catch(err => {
          localStorage.clear();
          return (window.location = "/#/Logout");
        });
    }
  }

  switchMenu = e => {
    this.setState({ summary: false });
  };
  maxSelectFile = event => {
    let files = event.target.files; // create file object
    if (files.length > 1) {
      const msg = "Only One file can be uploaded at a time";
      event.target.value = null; // discard selected file
      toast.warn(msg);
      return false;
    }
    return true;
  };

  closeViewerModal = () => {
    this.setState({ openViewer: false });
  };
  closePlyer = () => {
    this.setState({ openIssuesModal: false });
  };
  closeFindingsModal = () => {
    this.setState({ openFindingsModal: false });
  };
  OpenFindingsModal = () => {
    this.setState({ openFindingsModal: true });
  };
  openIssuesModal = () => {
    this.setState({ openIssuesModal: true, Orders: false });
  };
  openBackgroundModal = () => {
      this.setState({ openBackgroundsModal: true, Description: this.state.BackgroundInformation});
  };
  CloseBackgroundModal = () => {
    this.setState({ openBackgroundsModal: false });
  };
  openOrdersModal = () => {
    this.setState({ openIssuesModal: true, Orders: true });
  };
  handleDeleteDocument = d => {
    swal({
      text: "Are you sure that you want to remove this attachment?",
      icon: "warning",
      dangerMode: true,
      buttons: true
    }).then(willDelete => {
      if (willDelete) {
        return fetch("/api/decisiondocuments/" + d.Name, {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          }
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                toast.success("Removed");
                var rows = [...this.state.Documents];
                const filtereddata = rows.filter(item => item.Name !== d.Name);
                this.setState({ Documents: filtereddata });
              } else {
                swal("", "Remove Failed", "error");
              }
            })
          )
          .catch(err => {
            swal("", "Remove Failed", "error");
          });
      }
    });
  };
  handleDeleteFindings = d => {
    let datatosave = {
      ApplicationNo: this.state.ApplicationNo
    };
    swal({
      text: "Are you sure that you want to remove this record?",
      icon: "warning",
      dangerMode: true,
      buttons: true
    }).then(willDelete => {
      if (willDelete) {
        return fetch("/api/findingsonissues/" + d.NO, {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          },
          body: JSON.stringify(datatosave)
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                toast.success("Removed");
                var rows = [...this.state.Findings];
                const filtereddata = rows.filter(item => item.NO !== d.NO);
                this.setState({ Findings: filtereddata });
              } else {
                swal("", "Remove Failed", "error");
              }
            })
          )
          .catch(err => {
            swal("", "Remove Failed", "error");
          });
      }
    });
  };
  handleDeleteOrders = d => {
    let datatosave = {
      ApplicationNo: this.state.ApplicationNo
    };
    swal({
      text: "Are you sure that you want to remove this record?",
      icon: "warning",
      dangerMode: true,
      buttons: true
    }).then(willDelete => {
      if (willDelete) {
        return fetch("/api/decisionorders/" + d.NO, {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          },
          body: JSON.stringify(datatosave)
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                toast.success("Removed");
                var rows = [...this.state.Decisionorders];
                const filtereddata = rows.filter(item => item.NO !== d.NO);
                this.setState({ Decisionorders: filtereddata });
              } else {
                swal("", "Remove Failed", "error");
              }
            })
          )
          .catch(err => {
            swal("", "Remove Failed", "error");
          });
      }
    });
  };
  handleDeleteIsues = d => {
    let datatosave = {
      ApplicationNo: this.state.ApplicationNo
    };
    swal({
      text: "Are you sure that you want to remove this record?",
      icon: "warning",
      dangerMode: true,
      buttons: true
    }).then(willDelete => {
      if (willDelete) {
        return fetch("/api/issuesfordetermination/" + d.NO, {
          method: "Delete",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          },
          body: JSON.stringify(datatosave)
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                toast.success("Removed");
                var rows = [...this.state.Issues];
                const filtereddata = rows.filter(item => item.NO !== d.NO);
                this.setState({ Issues: filtereddata });
              } else {
                swal("", "Remove Failed", "error");
              }
            })
          )
          .catch(err => {
            swal("", "Remove Failed", "error");
          });
      }
    });
  };
  HandlePrevieView = d => {
    let filepath = d.Path + "/" + d.Name;
    var res = filepath.split(".");
    if (res[1] == "pdf") {
      this.setState({ openViewer: true });
    }
    if (res[1] == "PDF") {
      this.setState({ openViewer: true });
    }

    this.setState({ FileURL: filepath });
  };
   
  HandleIssuesEdit = d => {
    this.setState({
      Description: d.Description,
      openIssuesModal: true,
      Number: d.NO,
      IsUpdateissues: true
    });
  };
  HandleOrdersEdit = d => {
    this.setState({
      Description: d.Description,
      openIssuesModal: true,
      Orders: true,
      Number: d.NO,
      IsUpdateissues: true
    });
  };
  HandleFindingsEdit = d => {
    this.setState({
      Action: d.Actions,
      Description: d.Description,
      openFindingsModal: true,
      Number: d.NO,
      IsUpdateFindings: true
    });
  };
  ProtectRoute() {
    fetch("/api/UserAccess", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ privilages: data });
      })
      .catch(err => {
        //this.setState({ loading: false, redirect: true });
      });
    //end
  }
  validaterole = (rolename, action) => {
    let array = [...this.state.privilages];
    let AuditTrailsObj = array.find(obj => obj.RoleName === rolename);
    if (AuditTrailsObj) {
      if (action === "AddNew") {
        if (AuditTrailsObj.AddNew) {
          return true;
        } else {
          return false;
        }
      } else if (action === "View") {
        if (AuditTrailsObj.View) {
          return true;
        } else {
          return false;
        }
      } else if (action === "Edit") {
        if (AuditTrailsObj.Edit) {
          return true;
        } else {
          return false;
        }
      } else if (action === "Export") {
        if (AuditTrailsObj.Export) {
          return true;
        } else {
          return false;
        }
      } else if (action == "Remove") {
        if (AuditTrailsObj.Remove) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  HandleView = k => {
    const data = {
      ApplicationNo: k.ApplicationNo,
      summary: true,
      TenderName: k.TenderName,
      FilingDate: k.FilingDate,
      Status: k.Status,
      AwardDate: k.AwardDate,
      TenderNo: k.TenderNo,
      TenderValue: k.TenderValue,
      TenderCategory: k.TenderCategory,
      TenderSubCategory: k.TenderSubCategory,
      TenderType: k.TenderType
    };
    this.setState(data);
    this.fetchApplicantDetails(k.ApplicationNo);
    this.fetchBackgroundInformation(k.ApplicationNo);
    this.fetchPEDetails(k.ApplicationNo);
    this.fetchDocuments(k.ApplicationNo);
    this.fetchIssues(k.ApplicationNo);
    this.fetchFindings(k.ApplicationNo);
    this.fetchOrders(k.ApplicationNo);
  };
  PrintPDF = () => {
    let app = this.state.ApplicantDetails[0].Name;
    let pe = this.state.PEDetails[0].Name;
    const data = {
      Applicationno: this.state.ApplicationNo,
      Issues: this.state.Issues,
      Orders: this.state.Decisionorders,
      Findings: this.state.Findings,
      ApplicantName: app,
      PEName: pe,
        BackgroundInformation: this.state.BackgroundInformation,
      Applicationstatus: this.state.Status,
      FilingDate: dateFormat(
        new Date(this.state.FilingDate).toLocaleDateString(),
        "mediumDate"
      ),
      TenderNo: this.state.TenderNo,
      TenderName: this.state.TenderName,
      AwardDate: dateFormat(
        new Date(this.state.AwardDate).toLocaleDateString(),
        "mediumDate"
      ),
      TenderValue: this.state.TenderValue,
      TenderCategory: this.state.TenderCategory,
      TenderSubCategory: this.state.TenderSubCategory,
      TenderType: this.state.TenderType
    };
    fetch("/api/GenerateDecision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify(data)
    })
      .then(response =>
        response.json().then(data => {
          if (data.success) {
            let filepath =
              process.env.REACT_APP_BASE_URL +
              "/Decisions/" +
              this.state.ApplicationNo +
              ".pdf";
            this.setState({ FileURL: filepath, openViewer: true });
            //swal("", "Printed", "success");
          } else {
            swal("", data.message, "error");
          }
        })
      )
      .catch(err => {
        swal("Oops!", err.message, "error");
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    const data = {
      DecisionDate: this.state.DecisionDate,
      ApplicationNo: this.state.ApplicationNo,
      Followup: this.state.FollowUpRequired,
      Referral: this.state.RefertoDG,
      Closed: this.state.Closed
    };
    fetch("/api/Decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify(data)
    })
      .then(response =>
        response.json().then(data => {
          if (data.success) {
              this.fetchApplications()
             swal("", "Submited", "success");
              this.setState({ summary: false });
              
          } else {
            swal("", data.message, "error");
          }
        })
      )
      .catch(err => {
        swal("Oops!", err.message, "error");
      });
  };
  checkMimeType = event => {
    let files = event.target.files;
    let err = []; // create empty array

    const types = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
      "application/vnd.ms-word.document.macroEnabled.12",
      "application/vnd.ms - word.template.macroEnabled.12",
      "application/vnd.ms-excel",
      "application/vnd.ms-excel",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/vnd.ms-excel.template.macroEnabled.12",
      "application/vnd.ms-excel.addin.macroEnabled.12",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
      "application/vnd.ms-powerpoint",
      "application/vnd.ms-powerpoint",
      "application/vnd.ms-powerpoint",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.presentationml.template",
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
      "application/vnd.ms-powerpoint.addin.macroEnabled.12",
      "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
      "application/vnd.ms-powerpoint.template.macroEnabled.12",
      "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
      "application/vnd.ms-access"
    ];
    for (var x = 0; x < files.length; x++) {
      if (types.every(type => files[x].type !== type)) {
        err[x] = files[x].type + " is not a supported format\n";
        // assign message to array
      }
    }
    for (var z = 0; z < err.length; z++) {
      // loop create toast massage
      event.target.value = null;
      toast.error(err[z]);
      return false;
    }
    return true;
  };
  onChangeHandler = event => {
    //for multiple files
    var files = event.target.files;
    if (this.maxSelectFile(event) && this.checkMimeType(event)) {
      this.setState({
        selectedFile: files,
        loaded: 0
      });
    }
  };
  onClickHandler = event => {
    event.preventDefault();
    if (this.state.selectedFile) {
      const data = new FormData();
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append("file", this.state.selectedFile[x]);
      }
      axios
        .post("/api/upload/Docs/1", data, {
          // receive two parameter endpoint url ,form data
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
            });
          }
        })
        .then(res => {
          let path =
            process.env.REACT_APP_BASE_URL + "/HearingAttachments/Documents";
          this.saveDocuments(res.data, path);
        })
        .catch(err => {
          swal("", "upload fail", "error");
        });
    } else {
      swal("", "Please select a file to upload", "error");
    }
  };
  handleFindingsSubmit = event => {
    event.preventDefault();
    if (this.state.IsUpdateFindings) {
      const data = {
        ApplicationNo: this.state.ApplicationNo,
        Description: this.state.Description,
        Actions: this.state.Action
      };
      fetch("/api/findingsonissues/" + this.state.Number, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        },
        body: JSON.stringify(data)
      })
        .then(response =>
          response.json().then(data => {
            if (data.success) {
              swal("", "Added Successfully", "success");
              this.setState({
                Description: "",
                openFindingsModal: false,
                Number: "",
                IsUpdateFindings: false
              });
              this.fetchFindings(this.state.Description);
            } else {
              swal("", data.message, "error");
            }
          })
        )
        .catch(err => {
          swal("Oops!", err.message, "error");
        });
    } else {
      const data = {
        Number: this.state.Number,
        ApplicationNo: this.state.ApplicationNo,
        Description: this.state.Description,
        Actions: this.state.Action
      };
      fetch("/api/findingsonissues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        },
        body: JSON.stringify(data)
      })
        .then(response =>
          response.json().then(data => {
            if (data.success) {
              swal("", "Added Successfully", "success");
              var rows = this.state.Findings;
              const datatoPush = {
                NO: this.state.Number,
                ApplicationNo: this.state.ApplicationNo,
                Description: this.state.Description,
                Actions: this.state.Action
              };
              rows.push(datatoPush);
              this.setState({
                Findings: rows,
                Description: "",
                Number: "",
                IsUpdateFindings: false
              });
            } else {
              swal("", data.message, "error");
            }
          })
        )
        .catch(err => {
          swal("Oops!", err.message, "error");
        });
    }
  };
  handleIssuesSubmit = event => {
    event.preventDefault();
    if (this.state.Orders) {
      if (this.state.IsUpdateissues) {
        const data = {
          ApplicationNo: this.state.ApplicationNo,
          Description: this.state.Description
        };
        fetch("/api/decisionorders/" + this.state.Number, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          },
          body: JSON.stringify(data)
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                swal("", "Added Successfully", "success");
                this.setState({
                  Description: "",
                  openIssuesModal: false,
                  Orders: false,
                  Number: "",
                  IsUpdateissues: false
                });
                this.fetchOrders(this.state.ApplicationNo);
              } else {
                swal("", data.message, "error");
              }
            })
          )
          .catch(err => {
            swal("Oops!", err.message, "error");
          });
      } else {
        const data = {
          Number: this.state.Number,
          ApplicationNo: this.state.ApplicationNo,
          Description: this.state.Description
        };
        fetch("/api/decisionorders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          },
          body: JSON.stringify(data)
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                swal("", "Added Successfully", "success");
                var rows = this.state.Decisionorders;
                const datatoPush = {
                  NO: this.state.Number,
                  ApplicationNo: this.state.ApplicationNo,
                  Description: this.state.Description
                };
                rows.push(datatoPush);
                this.setState({
                  Decisionorders: rows,
                  Description: "",
                  Number: "",
                  IsUpdateissues: false
                });
              } else {
                swal("", data.message, "error");
              }
            })
          )
          .catch(err => {
            swal("Oops!", err.message, "error");
          });
      }
    } else {
      if (this.state.IsUpdateissues) {
        const data = {
          ApplicationNo: this.state.ApplicationNo,
          Description: this.state.Description
        };
        fetch("/api/issuesfordetermination/" + this.state.Number, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          },
          body: JSON.stringify(data)
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                swal("", "Added Successfully", "success");
                this.setState({
                  Description: "",
                  openIssuesModal: false,
                  Number: "",
                  IsUpdateissues: false
                });
                this.fetchIssues(this.state.ApplicationNo);
              } else {
                swal("", data.message, "error");
              }
            })
          )
          .catch(err => {
            swal("Oops!", err.message, "error");
          });
      } else {
        const data = {
          Number: this.state.Number,
          ApplicationNo: this.state.ApplicationNo,
          Description: this.state.Description
        };
        fetch("/api/issuesfordetermination", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token")
          },
          body: JSON.stringify(data)
        })
          .then(response =>
            response.json().then(data => {
              if (data.success) {
                swal("", "Added Successfully", "success");
                var rows = this.state.Issues;
                const datatoPush = {
                  NO: this.state.Number,
                  ApplicationNo: this.state.ApplicationNo,
                  Description: this.state.Description
                };
                rows.push(datatoPush);
                this.setState({
                  Issues: rows,
                  Description: "",
                  Number: "",
                  IsUpdateissues: false
                });
              } else {
                swal("", data.message, "error");
              }
            })
          )
          .catch(err => {
            swal("Oops!", err.message, "error");
          });
      }
    }
  };
  handleBackgroundinformationSubmit = event => {
    event.preventDefault();

    const data = {
      ApplicationNo: this.state.ApplicationNo,
      Backgroundinformation: this.state.Description
    };
    this.setState({ BackgroundInformation: this.state.Description });
    fetch("/api/Decision/Backgroundinformation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify(data)
    })
      .then(response =>
        response.json().then(data => {
          if (data.success) {
            swal("", "Added Successfully", "success");
            this.setState({ Description: "", openBackgroundsModal: false });
          } else {
            swal("", data.message, "error");
          }
        })
      )
      .catch(err => {
        swal("Oops!", err.message, "error");
      });
  };
  saveDocuments(FileName, path) {
    let datatosave = {
      ApplicationNo: this.state.ApplicationNo,
      Description: this.state.Description,
      path: path,
      Name: FileName,
      Confidential: this.state.Confidential
    };
    fetch("/api/decisiondocuments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify(datatosave)
    })
      .then(response =>
        response.json().then(data => {
          if (data.success) {
            toast.success("upload success");
            var rows = this.state.Documents;
            let datapush = {
              ApplicationNo: this.state.ApplicationNo,
              Path: path,
              Name: FileName,
              Description: this.state.Description
            };
            rows.push(datapush);
            this.setState({ Documents: rows });

            this.setState({ open: false });
          } else {
            toast.error("Could not be saved please try again!");
            // swal("Saved!", "Could not be saved please try again", "error");
          }
        })
      )
      .catch(err => {
        swal("", err.message, "error");
      });
  }

  onIssuesEditorChange = evt => {
    this.setState({
      Description: evt.editor.getData()
    });
  };

  render() {
    let FormStyle = {
      margin: "20px"
    };

    let headingstyle = {
      color: "#7094db"
    };

    const ColumnData = [
      {
        label: "ApplicationNo",
        field: "ApplicationNo",
        sort: "asc",
        width: 200
      },
      {
        label: "Procuring Entity",
        field: "ProcuringEntity",
        sort: "asc",
        width: 200
      },
      {
        label: "Tender Details",
        field: "TenderName",
        sort: "asc",
        width: 200
      },

      {
        label: "action",
        field: "action",
        sort: "asc",
        width: 200
      }
    ];
    let Rowdata1 = [];

    const rows = [...this.state.Applications];
    if (rows.length > 0) {
      rows.forEach(k => {
        const Rowdata = {
          ApplicationNo: k.ApplicationNo,
          ProcuringEntity: k.PEName,
          TenderName: k.TenderName,

          action: (
            <span>
              <a
                style={{ color: "#007bff" }}
                onClick={e => this.HandleView(k, e)}
              >
                More
              </a>
            </span>
          )
        };
        Rowdata1.push(Rowdata);
      });
    }

    let IssuesOptions = [...this.state.Issues].map((k, i) => {
      return {
        value: k.NO,
        label: k.NO
      };
    });
    let ActionsOptions = [
      {
        value: "Allowed",
        label: "Allowed"
      },
      {
        value: "Not Allowed",
        label: "Not Allowed"
      }
    ];

    if (this.state.summary) {
      return (
        <div>
          <ToastContainer />

          <div className="row wrapper border-bottom white-bg page-heading">
            <Modal
              visible={this.state.openViewer}
              width="80%"
              height="600"
              effect="fadeInUp"
              onClickAway={() => this.closeViewerModal()}
            >
              <div>
                <a
                  style={{ float: "right", color: "red", margin: "10px" }}
                  href="javascript:void(0);"
                  onClick={() => this.closeViewerModal()}
                >
                  Close
                </a>

                <object
                  width="100%"
                  height="570"
                  data={this.state.FileURL}
                  type="application/pdf"
                >
                  {" "}
                </object>
              </div>
            </Modal>
            <Modal
              visible={this.state.open}
              width="700"
              height="350"
              effect="fadeInUp"
              onClickAway={() => this.closeModal()}
            >
              <div>
                <a
                  style={{ float: "right", margin: "10px", color: "red" }}
                  href="javascript:void(0);"
                  onClick={() => this.closeModal()}
                >
                  Close
                </a>
                <br />
                <h4 style={{ "text-align": "center", color: "#1c84c6" }}>
                  Upload
                </h4>

                <div className="container-fluid">
                  <div className="col-sm-12">
                    <div className="ibox-content">
                      <form onSubmit={this.onClickHandler}>
                        <div className=" row">
                          <div className="col-sm-10">
                            <div className="form-group">
                              <label
                                htmlFor="exampleInputPassword1"
                                className="font-weight-bold"
                              >
                                Description
                              </label>
                              <input
                                onChange={this.handleInputChange}
                                value={this.state.Description}
                                type="text"
                                required
                                name="Description"
                                className="form-control"
                              />
                            </div>
                          </div>
                          <div className="col-sm-2">
                            <div className="form-group">
                              <br />
                              <label
                                htmlFor="Confidential"
                                className="font-weight-bold"
                              >
                                Confidential
                              </label>
                              <input
                                className="checkbox"
                                id="Confidential"
                                type="checkbox"
                                name="Confidential"
                                defaultChecked={this.state.Confidential}
                                onChange={this.handleInputChange}
                              />{" "}
                            </div>
                          </div>
                        </div>
                        <div className=" row">
                          <div className="col-sm">
                            <div className="form-group">
                              <label
                                htmlFor="exampleInputPassword1"
                                className="font-weight-bold"
                              >
                                Browse
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                name="file"
                                onChange={this.onChangeHandler}
                                multiple
                              />
                            </div>
                            <div class="form-group">
                              <Progress
                                max="100"
                                color="success"
                                value={this.state.loaded}
                              >
                                {Math.round(this.state.loaded, 2)}%
                              </Progress>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 ">
                          <div className=" row">
                            <div className="col-sm-2" />
                            <div className="col-sm-8" />
                            <div className="col-sm-2">
                              <button type="submit" class="btn btn-success ">
                                Upload
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            <Modal
              visible={this.state.openIssuesModal}
              width="80%"
              height="550px"
              effect="fadeInUp"
              onClickAway={() => this.closePlyer()}
            >
              <div>
                <a
                  style={{ float: "right", color: "red", margin: "10px" }}
                  href="javascript:void(0);"
                  onClick={() => this.closePlyer()}
                >
                  Close
                </a>
                <h4 style={{ "text-align": "center", color: "#1c84c6" }}>
                  {" "}
                  Issues for Determinations
                </h4>

                <div className="container-fluid">
                  <div className="col-sm-12">
                    <div className="ibox-content">
                      <form onSubmit={this.handleIssuesSubmit}>
                        <div className=" row">
                          <div class="col-sm-12">
                            <div className="col-sm-6">
                              <label
                                htmlFor="exampleInputPassword1"
                                className="font-weight-bold"
                              >
                                Number
                              </label>
                              <input
                                type="number"
                                name="Number"
                                required
                                onChange={this.handleInputChange}
                                value={this.state.Number}
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                        <div classname="row">
                          <div class="col-sm-12">
                            <label for="Name" className="font-weight-bold">
                              Description
                            </label>
                            <CKEditor
                              data={this.state.Description}
                              onChange={this.onIssuesEditorChange}
                            />
                          </div>
                        </div>
                        <br />
                        <div class="row">
                          <div className="col-sm-10"></div>
                          <div className="col-sm-2">
                            <button className="btn btn-primary" type="submit">
                              Add
                            </button>
                            &nbsp;
                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={this.closePlyer}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              visible={this.state.openFindingsModal}
              width="80%"
              height="550px"
              effect="fadeInUp"
              onClickAway={() => this.closeFindingsModal()}
            >
              <div>
                <a
                  style={{ float: "right", color: "red", margin: "10px" }}
                  href="javascript:void(0);"
                  onClick={() => this.closeFindingsModal()}
                >
                  Close
                </a>
                <h4 style={{ "text-align": "center", color: "#1c84c6" }}>
                  {" "}
                  Findings on Issues for Determinations
                </h4>

                <div className="container-fluid">
                  <div className="col-sm-12">
                    <div className="ibox-content">
                      <form onSubmit={this.handleFindingsSubmit}>
                        <div className=" row">
                          <div className="col-sm-6">
                            <label
                              htmlFor="exampleInputPassword1"
                              className="font-weight-bold"
                            >
                              Number
                            </label>
                            <Select
                              name="Number"
                              value={IssuesOptions.filter(
                                option => option.label === this.state.Number
                              )}
                              onChange={this.handleSelectChange}
                              options={IssuesOptions}
                              required
                            />
                          </div>
                          <div className="col-sm-6">
                            <label
                              htmlFor="exampleInputPassword1"
                              className="font-weight-bold"
                            >
                              Action
                            </label>
                            <Select
                              name="Action"
                              value={ActionsOptions.filter(
                                option => option.label === this.state.Action
                              )}
                              onChange={this.handleSelectChange}
                              options={ActionsOptions}
                              required
                            />
                          </div>
                        </div>
                        <div classname="row">
                          <div class="col-sm-12">
                            <label for="Name" className="font-weight-bold">
                              Description
                            </label>
                            <CKEditor
                              data={this.state.Description}
                              onChange={this.onIssuesEditorChange}
                            />
                          </div>
                        </div>
                        <br />
                        <div class="row">
                          <div className="col-sm-10"></div>
                          <div className="col-sm-2">
                            <button className="btn btn-primary" type="submit">
                              Add
                            </button>
                            &nbsp;
                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={this.closeFindingsModal}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              visible={this.state.openBackgroundsModal}
              width="80%"
              height="500px"
              effect="fadeInUp"
              onClickAway={() => this.CloseBackgroundModal()}
            >
              <div>
                <a
                  style={{ float: "right", color: "red", margin: "10px" }}
                  href="javascript:void(0);"
                  onClick={() => this.CloseBackgroundModal()}
                >
                  Close
                </a>
                <h4 style={{ "text-align": "center", color: "#1c84c6" }}>
                  {" "}
                  Background Information
                </h4>

                <div className="container-fluid">
                  <div className="col-sm-12">
                    <div className="ibox-content">
                      <form onSubmit={this.handleBackgroundinformationSubmit}>
                        <div classname="row">
                          <div class="col-sm-12">
                            <label for="Name" className="font-weight-bold">
                              Description
                            </label>
                            <CKEditor
                              data={this.state.Description}
                              onChange={this.onIssuesEditorChange}
                            />
                          </div>
                        </div>
                        <br />
                        <div class="row">
                          <div className="col-sm-10"></div>
                          <div className="col-sm-2">
                            <button className="btn btn-primary" type="submit">
                              Submit
                            </button>
                            &nbsp;
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            <div className="col-lg-10">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <h2>
                    Application No:{" "}
                    <span style={headingstyle}>{this.state.ApplicationNo}</span>{" "}
                  </h2>
                </li>
              </ol>
            </div>
            <div className="col-lg-2">
              <div className="row wrapper ">
                <button
                  type="button"
                  style={{ marginTop: 40 }}
                  // onClick={this.openModal}
                  onClick={this.switchMenu}
                  className="btn btn-primary  "
                >
                  Back
                </button>
              </div>
            </div>
          </div>
          <div className="wrapper wrapper-content animated fadeInRight">
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10 border border-success rounded bg-white">
                <form style={FormStyle}>
                  <div class="row">
                    <div class="col-sm-12">
                      <input
                        type="text"
                        disabled
                        value={this.state.TenderName}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-6">
                      <div class="col-sm-11 ">
                        <div className="row">
                          <div className="col-sm-12">
                            <h3 style={headingstyle}>Applicant</h3>
                          </div>
                        </div>
                        <div className="row border border-success rounded">
                          <table className="table table-borderless table-sm">
                            {this.state.ApplicantDetails.map((r, i) => (
                              <div>
                                <tr>
                                  <td className="font-weight-bold">Name:</td>
                                  <td>{r.Name}</td>
                                </tr>
                                <tr>
                                  <td className="font-weight-bold">Address:</td>
                                  <td>
                                    {r.POBox +
                                      "-" +
                                      r.PostalCode +
                                      " " +
                                      r.Town}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="font-weight-bold">Email:</td>
                                  <td>{r.Email}</td>
                                </tr>
                                <tr>
                                  <td className="font-weight-bold">
                                    Telephone
                                  </td>
                                  <td>{r.Mobile}</td>
                                </tr>
                              </div>
                            ))}
                          </table>
                        </div>
                      </div>
                    </div>

                    <div class="col-sm-6 ">
                      <div class="col-sm-11 ">
                        <div className="row">
                          <div className="col-sm-12">
                            <h3 style={headingstyle}>Procuring Entity</h3>
                          </div>
                        </div>
                        <div className="row border border-success rounded">
                          <table className="table table-borderless table-sm">
                            {this.state.PEDetails.map((r, i) => (
                              <div>
                                <tr>
                                  <td className="font-weight-bold">Name:</td>
                                  <td>{r.Name}</td>
                                </tr>
                                <tr>
                                  <td className="font-weight-bold">Address:</td>
                                  <td>
                                    {r.POBox +
                                      "-" +
                                      r.PostalCode +
                                      " " +
                                      r.Town}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="font-weight-bold">Email:</td>
                                  <td>{r.Email}</td>
                                </tr>
                                <tr>
                                  <td className="font-weight-bold">
                                    Telephone
                                  </td>
                                  <td>{r.Telephone}</td>
                                </tr>
                              </div>
                            ))}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10 ">
                <h3 style={headingstyle}>Background Information</h3>
                <div className="row border border-success rounded bg-white">
                  <div class="col-sm-12">
                    <br />
                    <button
                      className="btn btn-primary"
                      onClick={this.openBackgroundModal}
                    >
                      Add{" "}
                    </button>
                    <p></p>
                    <div>
                      <table class="table table-sm">
                        
                        <tbody>
                          <tr>
                            <td>
                              {ReactHtmlParser(
                                this.state.BackgroundInformation
                              )}
                            </td>
                            <td>
                              {" "}
                              <span>
                                <a
                                  style={{ color: "#007bff" }}
                                  onClick={
                                      this.openBackgroundModal
                                  }
                                >
                                  Edit
                                </a>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10 ">
                <h3 style={headingstyle}>Issues for Determinations</h3>
                <div className="row border border-success rounded bg-white">
                  <div class="col-sm-12">
                    <br />
                    <button
                      className="btn btn-primary"
                      onClick={this.openIssuesModal}
                    >
                      Add{" "}
                    </button>
                    <p></p>
                    <div>
                      <table class="table table-sm">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">NO</th>
                            <th scope="col"> Description</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.Issues.map((r, i) => (
                            <tr>
                              <td>{r.NO}</td>
                              <td>{ReactHtmlParser(r.Description)}</td>
                              <td>
                                {" "}
                                <span>
                                  <a
                                    style={{ color: "#007bff" }}
                                    onClick={e => this.HandleIssuesEdit(r, e)}
                                  >
                                    Edit
                                  </a>
                                  |
                                  <a
                                    style={{ color: "#f44542" }}
                                    onClick={e => this.handleDeleteIsues(r, e)}
                                  >
                                    &nbsp; Remove
                                  </a>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10 ">
                <h3 style={headingstyle}>Findings on Issues</h3>
                <div className="row border border-success rounded bg-white">
                  <div class="col-sm-12">
                    <br />
                    <button
                      className="btn btn-primary"
                      onClick={this.OpenFindingsModal}
                    >
                      Add{" "}
                    </button>
                    <p></p>
                    <div>
                      <table class="table table-sm">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">NO</th>
                            <th scope="col">Decision</th>
                            <th scope="col"> Description</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.Findings.map((r, i) => (
                            <tr>
                              <td>{r.NO}</td>
                              <td>{r.Actions}</td>

                              <td>{ReactHtmlParser(r.Description)}</td>
                              <td>
                                {" "}
                                <span>
                                  <a
                                    style={{ color: "#007bff" }}
                                    onClick={e => this.HandleFindingsEdit(r, e)}
                                  >
                                    Edit
                                  </a>
                                  |
                                  <a
                                    style={{ color: "#f44542" }}
                                    onClick={e =>
                                      this.handleDeleteFindings(r, e)
                                    }
                                  >
                                    &nbsp; Remove
                                  </a>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10 ">
                <h3 style={headingstyle}>Orders</h3>
                <div className="row border border-success rounded bg-white">
                  <div class="col-sm-12">
                    <br />
                    <button
                      className="btn btn-primary"
                      onClick={this.openOrdersModal}
                    >
                      Add{" "}
                    </button>
                    <p></p>
                    <div>
                      <table class="table table-sm">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">NO</th>
                            <th scope="col"> Description</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.Decisionorders.map((r, i) => (
                            <tr>
                              <td>{r.NO}</td>
                              <td>{ReactHtmlParser(r.Description)}</td>
                              <td>
                                {" "}
                                <span>
                                  <a
                                    style={{ color: "#007bff" }}
                                    onClick={e => this.HandleOrdersEdit(r, e)}
                                  >
                                    Edit
                                  </a>
                                  |
                                  <a
                                    style={{ color: "#f44542" }}
                                    onClick={e => this.handleDeleteOrders(r, e)}
                                  >
                                    &nbsp; Remove
                                  </a>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10 ">
                <h3 style={headingstyle}>Decision Documents</h3>
                <div className="row border border-success rounded bg-white">
                  <div class="col-sm-12">
                    <br />
                    <button
                      className="btn btn-primary"
                      onClick={this.openModal}
                    >
                      Add{" "}
                    </button>
                    <p></p>
                    <div>
                      <table class="table table-sm">
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">NO</th>
                            <th scope="col">Document Description</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.Documents.map((r, i) => (
                            <tr>
                              <td>{i + 1}</td>
                              <td>{r.Description}</td>
                              <td>
                                {" "}
                                <span>
                                  <a
                                    style={{ color: "#007bff" }}
                                    onClick={e => this.HandlePrevieView(r, e)}
                                  >
                                    View
                                  </a>{" "}
                                  |
                                  <a
                                    style={{ color: "#f44542" }}
                                    onClick={e =>
                                      this.handleDeleteDocument(r, e)
                                    }
                                  >
                                    &nbsp; Remove
                                  </a>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1"></div>
              <div className="col-lg-10 ">
                <h3 style={headingstyle}>Decision</h3>
                <div className="row border border-success rounded bg-white">
                  <div class="col-sm-12">
                    <form onSubmit={this.handleSubmit}>
                      <br />
                      <div classname="row">
                        <div class="col-sm-6">
                          <label for="Location" className="font-weight-bold">
                            Decision Date
                          </label>

                          <input
                            type="date"
                            name="DecisionDate"
                            required
                            defaultValue={this.state.DecisionDate}
                            className="form-control"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <div className="col-sm-2">
                          <input
                            className="checkbox"
                            id="Confidential"
                            type="checkbox"
                            name="FollowUpRequired"
                            defaultChecked={this.state.FollowUpRequired}
                            onChange={this.handleInputChange}
                          />
                          &nbsp;Follow Up Required
                        </div>
                        <div className="col-sm-2">
                          <input
                            className="checkbox"
                            id="RefertoDG"
                            type="checkbox"
                            name="RefertoDG"
                            defaultChecked={this.state.RefertoDG}
                            onChange={this.handleInputChange}
                          />
                          &nbsp;Refer to DG
                        </div>
                        <div className="col-sm-2">
                          <input
                            className="checkbox"
                            id="Closed"
                            type="checkbox"
                            name="Closed"
                            defaultChecked={this.state.Closed}
                            onChange={this.handleInputChange}
                          />
                          &nbsp;Closed
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        <div className="col-sm-9"></div>
                        <div className="col-sm-3">
                          <button className="btn btn-primary" type="submit">
                            Submit
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-success"
                            type="button"
                            onClick={this.PrintPDF}
                          >
                            Print
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-warning"
                            type="button"
                            onClick={this.switchMenu}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                      <br />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <ToastContainer />
          <div>
            <div className="row wrapper border-bottom white-bg page-heading">
              <div className="col-lg-10">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <h2>Decision preparations</h2>
                  </li>
                </ol>
              </div>
              <div className="col-lg-2">
                <div className="row wrapper ">
                  <Link to="/">
                    <button
                      type="button"
                      style={{ marginTop: 40 }}
                      onClick={this.openModal}
                      className="btn btn-warning  "
                    >
                      &nbsp; Close
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <TableWrapper>
            <Table Rows={Rowdata1} columns={ColumnData} />
          </TableWrapper>
        </div>
      );
    }
  }
}

export default DecisionPreparations;
