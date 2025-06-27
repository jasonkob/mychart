import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate API delay (like a real n8n webhook)
    await new Promise((resolve) => setTimeout(resolve, 1000))

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
    }

    return NextResponse.json(chartData)
  } catch (error) {
    console.error("Error in chart API:", error)
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 })
  }
}
