"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartProps {
    data: any[];
    dataKey: string;
    title?: string;
    yDomain?: [number | string, number | string];
}

export function WeightChart({ data, dataKey, yDomain = ['dataMin - 1', 'dataMax + 1'] }: ChartProps) {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-[300px] text-white/30 italic">No data available</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" tick={{ fill: "#888" }} />
                <YAxis domain={yDomain} stroke="#888" tick={{ fill: "#888" }} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
                    itemStyle={{ color: "#D4AF37" }}
                />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke="#D4AF37"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#D4AF37" }}
                    activeDot={{ r: 6, fill: "#fff" }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function CalorieChart({ data, dataKey }: ChartProps) {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-[300px] text-white/30 italic">No data available</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" tick={{ fill: "#888" }} />
                <YAxis stroke="#888" tick={{ fill: "#888" }} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Bar dataKey={dataKey} fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
