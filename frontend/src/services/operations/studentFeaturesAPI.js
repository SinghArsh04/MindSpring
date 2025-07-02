import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

// ================ buyCourse ================ 
// export async function buyCourse(token, coursesId, userDetails, navigate, dispatch) {
//     const toastId = toast.loading("Loading...");

//     try {
//         //load the script
//         const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

//         if (!res) {
//             toast.error("RazorPay SDK failed to load");
//             return;
//         }

//         // initiate the order
//         const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
//             { coursesId },
//             {
//                 Authorization: `Bearer ${token}`,
//             })
//         // console.log("orderResponse... ", orderResponse);
//         if (!orderResponse.data.success) {
//             throw new Error(orderResponse.data.message);
//         }

//         const RAZORPAY_KEY = import.meta.env.VITE_APP_RAZORPAY_KEY;
//         // console.log("RAZORPAY_KEY...", RAZORPAY_KEY);

//         // options
//         const options = {
//             key: RAZORPAY_KEY,
//             currency: orderResponse.data.message.currency,
//             amount: orderResponse.data.message.amount,
//             order_id: orderResponse.data.message.id,
//             name: "StudyNotion",
//             description: "Thank You for Purchasing the Course",
//             image: rzpLogo,
//             prefill: {
//                 name: userDetails.firstName,
//                 email: userDetails.email
//             },
//             handler: function (response) {
//                 //send successful mail
//                 sendPaymentSuccessEmail(response, orderResponse.data.message.amount, token);
//                 //verifyPayment
//                 verifyPayment({ ...response, coursesId }, token, navigate, dispatch);
//             }
//         }

//         const paymentObject = new window.Razorpay(options);
//         paymentObject.open();
//         paymentObject.on("payment.failed", function (response) {
//             toast.error("oops, payment failed");
//             console.log("payment failed.... ", response.error);
//         })

//     }
//     catch (error) {
//         console.log("PAYMENT API ERROR.....", error);
//         toast.error(error.response?.data?.message);
//         // toast.error("Could not make Payment");
//     }
//     toast.dismiss(toastId);
// }

//dev function temp
export async function buyCourse(token, coursesId, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Processing payment (dev)…");

  try {
    // — SKIP Razorpay SDK entirely —
    // const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    // if (!res) throw new Error("RazorPay SDK failed to load");

    // 1️⃣ “Initiate” the order (your backend stub will enroll immediately)
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { coursesId },
      { Authorization: `Bearer ${token}` }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || "Failed to initiate order");
    }

    // 2️⃣ Build a fake Razorpay response
    const fakeRzpResponse = {
      razorpay_order_id:   "DEV_ORDER_" + Date.now(),
      razorpay_payment_id: "DEV_PAY_"   + Date.now(),
      razorpay_signature:  "DEV_SIG",
    };

    // 3️⃣ Send “payment success” email
    await sendPaymentSuccessEmail(
      fakeRzpResponse,
      orderResponse.data.message.amount,
      token
    );

    // 4️⃣ Call your verifyPayment stub to finalize enrollment & navigation
    await apiConnector(
      "POST",
      VERIFY_PAYMENT_API,
      { ...fakeRzpResponse, coursesId },
      { Authorization: `Bearer ${token}` }
    );

    toast.success("✅ Enrollment successful (dev mode)");
    dispatch({ type: "COURSE_ENROLL_SUCCESS", payload: coursesId });
    navigate("/my-courses");
  }
  catch (error) {
    console.error("DEV buyCourse error:", error);
    toast.error(error.message || "Something went wrong");
  }
  finally {
    toast.dismiss(toastId);
  }
}






// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        }, {
            Authorization: `Bearer ${token}`
        })
    }
    catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}


// ================ verify payment ================
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        })

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, you are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}