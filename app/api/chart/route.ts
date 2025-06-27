import { NextResponse } from "next/server"

// URL ของ n8n webhook ที่ต้องการดึงข้อมูล
const N8N_WEBHOOK_URL = "http://172.29.66.159:5678/webhook/charturl";

export async function GET() {
  try {
    // ดึงข้อมูลจาก n8n webhook
    const n8nRes = await fetch(N8N_WEBHOOK_URL);
    if (!n8nRes.ok) throw new Error("Failed to fetch from n8n");
    let chartData = await n8nRes.json();

    // กรณี n8n ส่งข้อมูลในรูปแบบ { output: "...json..." }
    if (typeof chartData.output === "string") {
      try {
        chartData = JSON.parse(chartData.output);
      } catch (e) {
        console.error("Error parsing chartData.output as JSON", e);
        chartData = {};
      }
    }

    // ตรวจสอบและเติม options/scales ถ้ายังไม่มี
    if (!chartData.options) {
      chartData.options = {};
    }
    if (!chartData.options.scales) {
      chartData.options.scales = {
        x: { title: { display: true, text: "เดือน" } },
        y: { title: { display: true, text: "เวลาหยุดเครื่อง (นาที)" } },
      };
    } else {
      if (!chartData.options.scales.x) {
        chartData.options.scales.x = { title: { display: true, text: "เดือน" } };
      } else if (!chartData.options.scales.x.title) {
        chartData.options.scales.x.title = { display: true, text: "เดือน" };
      }
      if (!chartData.options.scales.y) {
        chartData.options.scales.y = { title: { display: true, text: "เวลาหยุดเครื่อง (นาที)" } };
      } else if (!chartData.options.scales.y.title) {
        chartData.options.scales.y.title = { display: true, text: "เวลาหยุดเครื่อง (นาที)" };
      }
    }
    // ตรวจสอบและเติม datasets ให้เป็น array เสมอ
    if (!Array.isArray(chartData.datasets)) {
      chartData.datasets = [];
    }
    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error in chart API:", error);
    // ถ้า fetch n8n ไม่ได้ ส่ง mock data เดิมกลับไป
    const chartData = {
      title: "กราฟแสดงเวลาหยุดเครื่องจักร",
      labels: ["ม.ค.", "ก.พ.", "มี.ค."],
      datasets: [
        {
          label: "เวลาหยุดเครื่อง",
          data: [100, 200, 150],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
      options: {
        scales: {
          x: {
            title: { display: true, text: "เดือน" },
          },
          y: {
            title: { display: true, text: "เวลาหยุดเครื่อง (นาที)" },
          },
        },
      },
    };
    return NextResponse.json(chartData);
  }
}

// ถ้าไม่ต้องการรับ webhook POST แล้ว สามารถลบฟังก์ชัน POST ออกได้
