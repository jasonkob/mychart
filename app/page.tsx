"use client"

import { useState, useEffect } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ChartData {
  title: string
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
  }>
  options: {
    scales: {
      x: {
        title: { display: boolean; text: string }
      }
      y: {
        title: { display: boolean; text: string }
      }
    }
  }
}

export default function HomePage() {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/chart")

        if (!response.ok) {
          throw new Error("Failed to fetch chart data")
        }

        const data = await response.json()
        setChartData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">ไม่พบข้อมูล</p>
        </div>
      </div>
    )
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "system-ui, -apple-system, sans-serif",
            size: 14,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: chartData.options.scales.x.title.display,
          text: chartData.options.scales.x.title.text,
          font: {
            family: "system-ui, -apple-system, sans-serif",
            size: 14,
            weight: "bold" as const,
          },
        },
        ticks: {
          font: {
            family: "system-ui, -apple-system, sans-serif",
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: chartData.options.scales.y.title.display,
          text: chartData.options.scales.y.title.text,
          font: {
            family: "system-ui, -apple-system, sans-serif",
            size: 14,
            weight: "bold" as const,
          },
        },
        ticks: {
          font: {
            family: "system-ui, -apple-system, sans-serif",
            size: 12,
          },
        },
      },
    },
  }

  const data = {
    labels: chartData.labels,
    datasets: chartData.datasets,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{chartData.title}</h1>
          <p className="text-gray-600">ข้อมูลจากระบบ n8n</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="h-96 md:h-[500px]">
            <Bar data={data} options={chartOptions} />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-lg px-6 py-3 shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">เวลาหยุดเครื่อง</span>
            </div>
            <div className="text-sm text-gray-500">อัปเดตล่าสุด: {new Date().toLocaleDateString("th-TH")}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
