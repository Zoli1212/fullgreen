"use client";

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

interface iAppProps {
  data: {
    date: string;
    revenue: number;
  }[];
}

type DataItem = {
  date: string;
  revenue: number;
};

type AggregatedItem = {
  date: string;
  revenue: number;
};

const aggregateData = (data: DataItem[]): AggregatedItem[] => {
  const aggregated = data.reduce<Record<string, number>>((acc, curr) => {
    if (acc[curr.date]) {
      acc[curr.date] += curr.revenue;
    } else {
      acc[curr.date] = curr.revenue;
    }
    return acc;
  }, {});

  return Object.keys(aggregated).map((date) => ({
    date,
    revenue: aggregated[date],
  }));
};

export function Chart({ data }: iAppProps) {
  const proccesedData = aggregateData(data);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={proccesedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          stroke="#3b82f6"
          activeDot={{ r: 8 }}
          dataKey="revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
