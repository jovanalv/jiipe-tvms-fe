import { useState, useEffect, useCallback, useMemo } from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import Swal from "sweetalert2";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import handleUnauthorized from "../../utils/redirect/handleUnauthorized";
import handleForbidden from "../../utils/redirect/handleForbidden";
import { getApiBaseUrl } from "../../utils/config";
import ActionButtons from "../../components/common/ActionButtons";
import FormTextArea from "../../components/form/FormTextArea";
import FormInput from "../../components/form/FormInput";
import { testMSURLApi } from "../../services/master/mstParamService";
import FormSelect from "../../components/form/FormSelect";
import Printer from "esc-pos-printer";
import FormSwitch from "../../components/form/FormSwitch";

export default function SettingParam() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [printers, setPrinters] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingVisitorApi, setIsTestingVisitorApi] = useState(false);
  const [isTestingContractorApi, setIsTestingContractorApi] = useState(false);
  const [isRestartMiddleware, setIsRestartMiddleware] = useState(false);
  const [visitorApiTestResult, setVisitorApiTestResult] = useState(null);
  const [contractorApiTestResult, setContractorApiTestResult] = useState(null);
  let selectedPrinter = localStorage.getItem("printerThermal");

  const API_BASE_URL = useMemo(() => getApiBaseUrl() + "set_param/auth", []);

  const fetchPrinters = async () => {
    try {
      const printer = new Printer();
      const printerList = await printer.getPrinters();

      const formattedData = printerList.map((p) => ({
        label: p,
        value: p,
      }));
      setPrinters(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [
        visitRes,
        runTextRes,
        msapiRes,
        contractorApiRes,
        expPerRes,
        configTokenRes,
        carouselErtRes,
        overstayRes,
        expDateLeftCtrRes,
        qrPrintedRes,
        transUpRes,
        unplannedRes,
        ctrInHourRes,
        expDateCtrRes,
        minuteUndfnRes,
        driverVisitRes,
        dsbIntervalRes,
        isAccHourRes,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/VISIT_TIME`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/RUN_TEXT`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/MS_API`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/MS_API_CONTRACTOR`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/bulk/PERSONNEL_EXP`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/bulk/MS_API_ACCESS_TOKEN`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/ERT_CAROUSEL`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/OVERSTAY`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/EXP_DATE_CTR_LEFT`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/bulk/QR_PRINTED`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/TRANS_UP`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/VISITOR_UNPLANNED`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/bulk/CTR_IN_HOUR`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/bulk/EXP_DATE_CTR`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/LAST_EVAC_UNDFN`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/DRIVER_VISIT_TIME`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/DSB_CAROUSEL`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${API_BASE_URL}/IS_ACC_HOUR`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (visitRes.status === 403 || runTextRes.status === 403) {
        handleForbidden(403, navigate);
        return;
      }

      if (visitRes.status === 401 || runTextRes.status === 401) {
        handleUnauthorized(401, navigate);
        return;
      }

      const [
        visitData,
        runTextData,
        msapiData,
        contractorApiData,
        expPerData,
        configTokenData,
        carouselErtData,
        overstayData,
        expDateCtrLeftData,
        qrPrintedData,
        transUpData,
        unplannedData,
        ctrInHour,
        expDateCtrData,
        minuteUndfnData,
        driverVisitData,
        dsbIntervalData,
        isAccHourData,
      ] = await Promise.all([
        visitRes.json(),
        runTextRes.json(),
        msapiRes.json(),
        contractorApiRes.json(),
        expPerRes.json(),
        configTokenRes.json(),
        carouselErtRes.json(),
        overstayRes.json(),
        expDateLeftCtrRes.json(),
        qrPrintedRes.json(),
        transUpRes.json(),
        unplannedRes.json(),
        ctrInHourRes.json(),
        expDateCtrRes.json(),
        minuteUndfnRes.json(),
        driverVisitRes.json(),
        dsbIntervalRes.json(),
        isAccHourRes.json(),
      ]);

      if (visitData.success && runTextData.success) {
        setFormData({
          ...visitData.data,
          run_txt: runTextData.data.pval3,
          msapi: msapiData.data.pval3,
          contractor_api: contractorApiData.data.pval3,
          exp_emp: expPerData.data.find((exp) => exp.pval3 === "EMP")?.pval1,
          exp_ctr: expPerData.data.find((exp) => exp.pval3 === "CTR")?.pval1,
          tenant_id: configTokenData.data.find((t) => t.pval3 === "TENANT_ID")
            ?.pval2,
          client_id: configTokenData.data.find((t) => t.pval3 === "CLIENT_ID")
            ?.pval2,
          client_secret: configTokenData.data.find(
            (t) => t.pval3 === "CLIENT_SECRET"
          )?.pval2,
          scope: configTokenData.data.find((t) => t.pval3 === "SCOPE")?.pval2,
          token_url: configTokenData.data.find((t) => t.pval3 === "TOKEN_URL")
            ?.pval2,
          ert_carousel: carouselErtData.data.pval2,
          overstay_hour: overstayData.data.pval2,
          exp_date_ctr: expDateCtrLeftData.data.pval2,
          qr_printed_k: qrPrintedData.data.find((t) => t.pval3 === "K")?.pval2,
          qr_printed_v: qrPrintedData.data.find((t) => t.pval3 === "V")?.pval2,
          trans_up: transUpData.data.pval2,
          unplanned: unplannedData.data.pval1 == "1",
          ctrInHourStart1: ctrInHour.data.find((ctr) => ctr.pval3 === "1")
            ?.pval1,
          ctrInHourEnd1: ctrInHour.data.find((ctr) => ctr.pval3 === "1")?.pval2,
          ctrInHourStart2: ctrInHour.data.find((ctr) => ctr.pval3 === "2")
            ?.pval1,
          ctrInHourEnd2: ctrInHour.data.find((ctr) => ctr.pval3 === "2")?.pval2,
          exp_ctr_date_h: expDateCtrData.data.find((ctr) => ctr.pval3 === "H")
            ?.pval1,
          exp_ctr_month_h: expDateCtrData.data.find((ctr) => ctr.pval3 === "H")
            ?.pval2,
          exp_ctr_date_p: expDateCtrData.data.find((ctr) => ctr.pval3 === "P")
            ?.pval1,
          exp_ctr_month_p: expDateCtrData.data.find((ctr) => ctr.pval3 === "P")
            ?.pval2,
          minuteUndfn: minuteUndfnData.data.pval1,
          driverDay: driverVisitData.data.pval1,
          driverStart: driverVisitData.data.pval2,
          driverEnd: driverVisitData.data.pval3,
          dsbInterval: dsbIntervalData.data.pval2,
          isAccHour: isAccHourData.data.pval1 == "1",
        });
      } else {
        throw new Error("Invalid data format or no data received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, token, navigate]);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchData(), fetchPrinters()]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "printerThermal") {
      localStorage.setItem("printerThermal", value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRestartMiddleware = async () => {
    try {
      setIsRestartMiddleware(true);

      const response = await fetch(`${API_BASE_URL}/restart-middleware`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        await fetchData();

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "The middleware has been restarted successfully.",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message || "Failed to save data",
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Restart Middleware Service",
        text: `${error.message}`,
      });
    } finally {
      setIsRestartMiddleware(false);
    }
  };

  const handleTestVisitorApi = async () => {
    if (!formData.msapi || formData.msapi.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter Visitor API URL before testing",
      });
      return;
    }

    setIsTestingVisitorApi(true);
    setVisitorApiTestResult(null);
    let startTime;

    try {
      startTime = Date.now();

      const payload = {
        url: formData.msapi,
      };

      let response = await testMSURLApi(payload);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setVisitorApiTestResult({
        success: true,
        status: response.status,
        statusText: response.statusText,
        responseTime: responseTime,
        data: response?.data?.data,
        headers: response.headers,
      });

      await Swal.fire({
        icon: "success",
        title: "Visitor API Test Successful",
        text: `API responded with status ${response.status} in ${responseTime}ms`,
      });
    } catch (error) {
      const responseTime = error.response ? Date.now() - startTime : null;

      setVisitorApiTestResult({
        success: false,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseTime: responseTime,
        data: error.response?.data,

        error: error.message,
      });

      await Swal.fire({
        icon: "error",
        title: "Visitor API Test Error",
        text: error.response
          ? `API responded with status ${error.response.status}: ${error.response.statusText}`
          : `Failed to connect to API: ${error.message}`,
      });
    } finally {
      setIsTestingVisitorApi(false);
    }
  };

  const handleTestContractorApi = async () => {
    if (!formData.contractor_api || formData.contractor_api.trim() === "") {
      await Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter Contractor API URL before testing",
      });
      return;
    }

    setIsTestingContractorApi(true);
    setContractorApiTestResult(null);
    let startTime;

    try {
      startTime = Date.now();

      const payload = {
        url: formData.contractor_api,
      };

      let response = await testMSURLApi(payload);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setContractorApiTestResult({
        success: true,
        status: response.status,
        statusText: response.statusText,
        responseTime: responseTime,
        data: response?.data?.data,
        headers: response.headers,
      });

      await Swal.fire({
        icon: "success",
        title: "Contractor API Test Successful",
        text: `API responded with status ${response.status} in ${responseTime}ms`,
      });
    } catch (error) {
      const responseTime = error.response ? Date.now() - startTime : null;

      setContractorApiTestResult({
        success: false,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseTime: responseTime,
        data: error.response?.data,
        error: error.message,
      });

      await Swal.fire({
        icon: "error",
        title: "Contractor API Test Error",
        text: error.response
          ? `API responded with status ${error.response.status}: ${error.response.statusText}`
          : `Failed to connect to API: ${error.message}`,
      });
    } finally {
      setIsTestingContractorApi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (formData.printerThermal) {
      localStorage.setItem("printerThermal", formData.printerThermal);
    }

    const putData = (url, payload) =>
      fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

    try {
      const [
        visitTimeRes,
        runningTextRes,
        msapiRes,
        contractorApiRes,
        empExpRes,
        ctrExpRes,
        tenantRes,
        clientRes,
        clientSecrRes,
        scopeRes,
        tokenUrlRes,
        carouselErtRes,
        overstayRes,
        expDateCtrRes,
        qrPrintedKRes,
        qrPrintedVRes,
        transUpRes,
        unplannedRes,
        ctrInHour1res,
        ctrInHour2res,
        ctrExpDateHRes,
        ctrExpDatePRes,
        minuteUndfnRes,
        driverVisitRes,
        dsbIntervalRes,
        isAccHourRes,
      ] = await Promise.all([
        putData(`${API_BASE_URL}/VISIT_TIME`, {
          pval1: formData.pval1,
          pval2: formData.pval2,
          pval3: formData.pval3,
        }),
        putData(`${API_BASE_URL}/RUN_TEXT`, {
          pval3: formData.run_txt,
        }),
        putData(`${API_BASE_URL}/MS_API`, {
          pval3: formData.msapi,
        }),
        putData(`${API_BASE_URL}/MS_API_CONTRACTOR`, {
          pval3: formData.contractor_api,
        }),
        putData(`${API_BASE_URL}/PERSONNEL_EXP/EMP`, {
          pval1: formData.exp_emp,
        }),
        putData(`${API_BASE_URL}/PERSONNEL_EXP/CTR`, {
          pval1: formData.exp_ctr,
        }),
        putData(`${API_BASE_URL}/MS_API_ACCESS_TOKEN/TENANT_ID`, {
          pval2: formData.tenant_id,
        }),
        putData(`${API_BASE_URL}/MS_API_ACCESS_TOKEN/CLIENT_ID`, {
          pval2: formData.client_id,
        }),
        putData(`${API_BASE_URL}/MS_API_ACCESS_TOKEN/CLIENT_SECRET`, {
          pval2: formData.client_secret,
        }),
        putData(`${API_BASE_URL}/MS_API_ACCESS_TOKEN/SCOPE`, {
          pval2: formData.scope,
        }),
        putData(`${API_BASE_URL}/MS_API_ACCESS_TOKEN/TOKEN_URL`, {
          pval2: formData.token_url,
        }),
        putData(`${API_BASE_URL}/ERT_CAROUSEL`, {
          pval2: formData.ert_carousel,
        }),
        putData(`${API_BASE_URL}/OVERSTAY`, {
          pval2: formData.overstay_hour,
        }),
        putData(`${API_BASE_URL}/EXP_DATE_CTR_LEFT`, {
          pval2: formData.exp_date_ctr,
        }),
        putData(`${API_BASE_URL}/QR_PRINTED/K`, {
          pval2: formData.qr_printed_k,
        }),
        putData(`${API_BASE_URL}/QR_PRINTED/V`, {
          pval2: formData.qr_printed_v,
        }),
        putData(`${API_BASE_URL}/TRANS_UP`, {
          pval2: formData.trans_up,
        }),
        putData(`${API_BASE_URL}/VISITOR_UNPLANNED`, {
          pval1: formData.unplanned ? "1" : "0",
        }),
        putData(`${API_BASE_URL}/CTR_IN_HOUR/1`, {
          pval1: formData.ctrInHourStart1,
          pval2: formData.ctrInHourEnd1,
        }),
        putData(`${API_BASE_URL}/CTR_IN_HOUR/2`, {
          pval1: formData.ctrInHourStart2,
          pval2: formData.ctrInHourEnd2,
        }),
        putData(`${API_BASE_URL}/EXP_DATE_CTR/H`, {
          pval1: formData.exp_ctr_date_h,
          pval2: formData.exp_ctr_month_h,
        }),
        putData(`${API_BASE_URL}/EXP_DATE_CTR/P`, {
          pval1: formData.exp_ctr_date_p,
          pval2: formData.exp_ctr_month_p,
        }),
        putData(`${API_BASE_URL}/LAST_EVAC_UNDFN`, {
          pval1: formData.minuteUndfn,
        }),
        putData(`${API_BASE_URL}/DRIVER_VISIT_TIME`, {
          pval1: formData.driverDay,
          pval2: formData.driverStart,
          pval3: formData.driverEnd,
        }),
        putData(`${API_BASE_URL}/DSB_CAROUSEL`, {
          pval2: formData.dsbInterval,
        }),
        putData(`${API_BASE_URL}/IS_ACC_HOUR`, {
          pval1: formData.isAccHour ? "1" : "0",
        }),
      ]);

      if (
        visitTimeRes.ok &&
        runningTextRes.ok &&
        msapiRes.ok &&
        contractorApiRes.ok &&
        empExpRes.ok &&
        ctrExpRes.ok &&
        tenantRes.ok &&
        clientRes.ok &&
        clientSecrRes.ok &&
        scopeRes.ok &&
        tokenUrlRes.ok &&
        carouselErtRes.ok &&
        overstayRes.ok &&
        expDateCtrRes.ok &&
        qrPrintedKRes.ok &&
        qrPrintedVRes.ok &&
        transUpRes.ok &&
        unplannedRes.ok &&
        ctrInHour1res.ok &&
        ctrInHour2res.ok &&
        ctrExpDateHRes.ok &&
        ctrExpDatePRes.ok &&
        minuteUndfnRes.ok &&
        driverVisitRes.ok &&
        dsbIntervalRes.ok &&
        isAccHourRes.ok
      ) {
        await fetchData();
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Parameter Success Changed!",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatJsonString = (obj) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return obj;
    }
  };

  const dateOptions = Array.from({ length: 30 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  const renderApiTestResult = (testResult, title) => {
    if (!testResult) return null;

    return (
      <div className="p-4 mt-4 border rounded-lg bg-gray-50">
        <h3 className="mb-3 text-sm font-medium text-gray-700">{title}</h3>

        <div className="space-y-3">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 input-text-size">
              Status:
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full input-text-size font-medium ${
                testResult.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {testResult.success ? "Success" : "Failed"}
              {testResult.status && ` (${testResult.status})`}
            </span>
          </div>

          {/* Response Time */}
          {testResult.responseTime && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 input-text-size">
                Response Time:
              </span>
              <span className="text-gray-800 input-text-size">
                {testResult.responseTime}ms
              </span>
            </div>
          )}

          {/* Error Message */}
          {testResult.error && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-600 input-text-size">
                Error:
              </span>
              <span className="text-red-600 input-text-size">
                {testResult.error}
              </span>
            </div>
          )}

          {/* Response Data */}
          {testResult.data && (
            <div>
              <span className="block mb-1 font-medium text-gray-600 input-text-size">
                Response Data:
              </span>
              <pre className="p-3 overflow-auto text-gray-800 bg-white border rounded input-text-size max-h-40">
                {formatJsonString(testResult.data)}
              </pre>
            </div>
          )}

          {/* Response Headers */}
          {testResult.headers && Object.keys(testResult.headers).length > 0 && (
            <div>
              <span className="block mb-1 font-medium text-gray-600 input-text-size">
                Response Headers:
              </span>
              <pre className="p-3 overflow-auto text-gray-800 bg-white border rounded input-text-size max-h-32">
                {formatJsonString(testResult.headers)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="px-4 py-2 mx-auto max-w-screen-2xl lg:px-4">
      {isLoading ? (
        <Loader screen={true} />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <Breadcrumbs />
            <ActionButtons
              onSave={handleSubmit}
              showBack={true}
              showAddData={false}
              showFilter={false}
              showUploadExcel={false}
              isLoading={isSubmitting}
            />
          </div>
          <>
            <div className="grid grid-cols-1 gap-4">
              {/* MS API Tenant Config */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Configure MS API Tenant
                </h2>
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormInput
                        label="Tenant ID"
                        id="tenant_id"
                        name="tenant_id"
                        value={formData.tenant_id || ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Client ID"
                        id="client_id"
                        name="client_id"
                        value={formData.client_id || ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Client Secret"
                        id="client_secret"
                        name="client_secret"
                        type="password"
                        value={formData.client_secret || ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Scope"
                        id="scope"
                        name="scope"
                        value={formData.scope || ""}
                        onChange={handleChange}
                      />
                      <FormInput
                        label="Token URL"
                        id="token_url"
                        name="token_url"
                        value={formData.token_url || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* MS API - Visitor */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Get Visitor Registered From API
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <FormTextArea
                    label={"API URL"}
                    id="msapi"
                    name="msapi"
                    value={formData?.msapi || ""}
                    onChange={handleChange}
                  />

                  <div className="flex gap-2 ">
                    <Button
                      type="button"
                      onClick={handleTestVisitorApi}
                      isLoading={isTestingVisitorApi}
                      variant="doff"
                      label="Test API"
                      icon={"Activity"}
                      disabled={!formData.msapi || formData.msapi.trim() === ""}
                    />
                  </div>

                  {renderApiTestResult(
                    visitorApiTestResult,
                    "Visitor API Test Result"
                  )}
                </div>
              </div>

              {/* MS API CONTRACTOR */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Get Contractor Registered From API
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <FormTextArea
                    label={"API URL"}
                    id="contractor_api"
                    name="contractor_api"
                    value={formData?.contractor_api || ""}
                    onChange={handleChange}
                  />

                  <div className="flex gap-2 ">
                    <Button
                      type="button"
                      onClick={handleTestContractorApi}
                      isLoading={isTestingContractorApi}
                      variant="doff"
                      label="Test API"
                      icon={"Activity"}
                      disabled={
                        !formData.contractor_api ||
                        formData.contractor_api.trim() === ""
                      }
                    />
                  </div>

                  {renderApiTestResult(
                    contractorApiTestResult,
                    "Contractor API Test Result"
                  )}
                </div>
              </div>

              {/* Visit Time */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Visitor Time Settings
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label={"Visitor Duration (Working Days)"}
                    type="number"
                    id="pval1"
                    name="pval1"
                    min={1}
                    value={formData.pval1 || ""}
                    onChange={(e) => {
                      const raw = e.target.value;

                      if (raw === "0" || raw === "") return;

                      let total = Number(e.target.value);
                      if (isNaN(total) || total < 1) {
                        total = 1;
                      }

                      handleChange(e);
                    }}
                  />

                  <div></div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label={"Visit Start Time (Hour/Minute)"}
                      type="time"
                      id="pval2"
                      name="pval2"
                      value={formData.pval2 || ""}
                      onChange={handleChange}
                    />

                    <FormInput
                      label={"Visit End Time (Hour/Minute)"}
                      type="time"
                      id="pval3"
                      name="pval3"
                      value={formData.pval3 || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Driver Visit Time */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Driver Visitor Time Settings
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label={"Visitor Duration (Working Days)"}
                    type="number"
                    id="driverDay"
                    name="driverDay"
                    min={1}
                    value={formData.driverDay || ""}
                    onChange={(e) => {
                      const raw = e.target.value;

                      if (raw === "0" || raw === "") return;

                      let total = Number(e.target.value);
                      if (isNaN(total) || total < 1) {
                        total = 1;
                      }

                      handleChange(e);
                    }}
                  />

                  <div></div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label={"Visit Start Time (Hour/Minute)"}
                      type="time"
                      id="driverStart"
                      name="driverStart"
                      value={formData.driverStart || ""}
                      onChange={handleChange}
                    />

                    <FormInput
                      label={"Visit End Time (Hour/Minute)"}
                      type="time"
                      id="driverEnd"
                      name="driverEnd"
                      value={formData.driverEnd || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Employee & Contractor Expiration Settings */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Personnel Expiration Settings
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Employee marked inactive after (days of no IN/OUT)"
                      type="number"
                      id="exp_emp"
                      name="exp_emp"
                      value={formData.exp_emp || ""}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="Contractor marked inactive after (days of no IN/OUT)"
                      type="number"
                      id="exp_ctr"
                      name="exp_ctr"
                      value={formData.exp_ctr || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Contractor Entry Time */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Contractor Entry Time Settings
                </h2>
                {/* Toggle On Off Contractor Access Hour */}

                <div className="grid grid-cols-4 mb-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormSwitch
                        name={"isAccHour"}
                        label={"Enable Contractor Access Hour"}
                        value={formData.isAccHour || ""}
                        onChange={handleChange}
                        labelTrue={"Active"}
                        labelFalse={"Inactive"}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label={"Start Time (Hour/Minute)"}
                      type="time"
                      id="ctrInHourStart1"
                      name="ctrInHourStart1"
                      value={formData.ctrInHourStart1 || ""}
                      disabled={!formData.isAccHour}
                      onChange={handleChange}
                    />

                    <FormInput
                      label={"End Time (Hour/Minute)"}
                      type="time"
                      id="ctrInHourEnd1"
                      name="ctrInHourEnd1"
                      value={formData.ctrInHourEnd1 || ""}
                      disabled={!formData.isAccHour}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label={"Start Time (Hour/Minute)"}
                      type="time"
                      id="ctrInHourStart2"
                      name="ctrInHourStart2"
                      value={formData.ctrInHourStart2 || ""}
                      disabled={!formData.isAccHour}
                      onChange={handleChange}
                    />

                    <FormInput
                      label={"End Time (Hour/Minute)"}
                      type="time"
                      id="ctrInHourEnd2"
                      name="ctrInHourEnd2"
                      value={formData.ctrInHourEnd2 || ""}
                      disabled={!formData.isAccHour}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Running Text */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Dashboard Running Text
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <FormTextArea
                    label={"Content"}
                    id="run_txt"
                    name="run_txt"
                    value={formData?.run_txt || ""}
                    onChange={handleChange}
                  />

                  <div></div>
                </div>
              </div>

              {/* Dashboard ERT Carousel */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Configure Dashboard ERT Carousel
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Interval Carousel Time (ms) Dash. People Counting"
                      id="dsbInterval"
                      name="dsbInterval"
                      value={formData.dsbInterval || ""}
                      onChange={handleChange}
                      type="number"
                    />

                    <FormInput
                      label="Interval Carousel Time (ms) Dash. ERT"
                      id="ert_carousel"
                      name="ert_carousel"
                      value={formData.ert_carousel || ""}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>
                </div>
              </div>

              {/* Overstay Hour Setting */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Configure Overstay Personnel Hour
                </h2>
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormInput
                        label="Overstay Hour Limit (Hours)"
                        id="overstay_hour"
                        name="overstay_hour"
                        value={formData.overstay_hour || ""}
                        onChange={handleChange}
                        type="number"
                        placeholder="e.g. 9"
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Date Revoke Contractor Setting */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Configure Contractor Expired Warning
                </h2>
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormInput
                        label="Warning Before Expiration (days)"
                        id="exp_date_ctr"
                        name="exp_date_ctr"
                        type="number"
                        value={formData.exp_date_ctr || ""}
                        onChange={handleChange}
                        min="1"
                        placeholder="Enter number of days before expiration"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      System will send a warning when contractor is about to
                      expire{" "}
                      <span className="font-semibold text-red-500">
                        {formData.exp_date_ctr || "X"}
                      </span>{" "}
                      days before.
                    </p>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Configure Contractor Expiration Date Monthly Settings */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Configure Default Contractor (In House / Project Based)
                  Expiration
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                  Set the default expiration date for contractors. Specify the
                  day of the month and the interval in months.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      label="Contractor In House Expiration Date"
                      name="exp_ctr_date_h"
                      options={dateOptions}
                      value={
                        dateOptions?.find(
                          (option) => option.value === formData.exp_ctr_date_h
                        ) || null
                      }
                      onChange={handleChange}
                      isBlurAfterSelect={true}
                      required={true}
                    />
                    <FormInput
                      label="Contractor In House Expiration Interval (Months)"
                      type="number"
                      id="exp_ctr_month_h"
                      name="exp_ctr_month_h"
                      value={formData.exp_ctr_month_h || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      label="Contractor Project Based Expiration Date"
                      name="exp_ctr_date_p"
                      options={dateOptions}
                      value={
                        dateOptions?.find(
                          (option) => option.value === formData.exp_ctr_date_p
                        ) || null
                      }
                      onChange={handleChange}
                      isBlurAfterSelect={true}
                      required={true}
                    />
                    <FormInput
                      label="Contractor Project Based Expiration Interval (Months)"
                      type="number"
                      id="exp_ctr_month_p"
                      name="exp_ctr_month_p"
                      value={formData.exp_ctr_month_p || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* QR Code Max Printed Setting */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Configure Maximum QR Code Prints per User
                </h2>
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormInput
                        label="Maximum Prints Per QR Code (Contractor)"
                        id="qr_printed_k"
                        name="qr_printed_k"
                        value={formData.qr_printed_k || ""}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        placeholder="Enter maximum print limit"
                      />

                      <FormInput
                        label="Maximum Prints Per QR Code (Visitor)"
                        id="qr_printed_v"
                        name="qr_printed_v"
                        value={formData.qr_printed_v || ""}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        placeholder="Enter maximum print limit"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Up Minute Setting */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Multiple IN Threshold (minutes)
                </h2>
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormInput
                        label="Threshold (minutes)"
                        id="trans_up"
                        name="trans_up"
                        value={formData.trans_up || ""}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        placeholder="Enter minimum transaction minute"
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Last Evac Undfn Setting */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Evacuation Undefined Threshold (Minutes)
                </h2>
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormInput
                        label="Threshold (minutes)"
                        id="minuteUndfn"
                        name="minuteUndfn"
                        value={formData.minuteUndfn || ""}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        placeholder="Enter Threshold (Minutes)"
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Setup Print Thermal */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Thermal Printer Setup
                </h2>
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormSelect
                        label="Thermal Printer"
                        name="printerThermal"
                        options={printers}
                        value={
                          printers?.find(
                            (option) => option.value === selectedPrinter
                          ) || null
                        }
                        onChange={handleChange}
                        placeholder="Select your therm-al printer"
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Toggle On Off Visito Unplanned */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Show Visitor Unplanned Form
                </h2>
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
                      <FormSwitch
                        name={"unplanned"}
                        value={formData.unplanned || ""}
                        onChange={handleChange}
                        labelTrue={"Active"}
                        labelFalse={"Inactive"}
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Restart Service Middleware */}
              <div className="p-6 bg-white rounded-lg border border-[#D1D1D199]">
                <h2 className="mb-4 text-lg font-medium">
                  Restart Middleware Service
                </h2>
                <div className="flex">
                  <Button
                    type="button"
                    onClick={handleRestartMiddleware}
                    isLoading={isRestartMiddleware}
                    variant="doff"
                    label="Restart Middleware Service"
                    icon={"RotateCcw"}
                  />

                  <div></div>
                </div>
              </div>
            </div>
          </>
        </form>
      )}
    </main>
  );
}
