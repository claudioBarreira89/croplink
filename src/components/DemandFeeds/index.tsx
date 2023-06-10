import { Box, Container, Flex, Heading, Select, Text } from "@chakra-ui/react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import Sidebar from "../Sidebar";

type CropTypeData = {
  date: string;
  grossNewSales: number;
  unitName: string;
};

type CropType = {
  commodityCode: string;
  commodityName: string;
  cumulativeChange: number;
  data: CropTypeData[];
};

const MyChart = ({ rawData, idx }: { rawData: CropType[]; idx: number }) => {
  if (!rawData || !rawData.length) return null;

  const data = {
    labels: [],
    datasets: [{ data: [] }],
  };

  const options = {
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { borderDash: [3, 3] },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  } as any;

  const currCropData = rawData[idx].data;

  for (let i = currCropData.length - 1; i >= 0; i--) {
    const d = currCropData[i];
    let { date, grossNewSales } = d;
    data.labels.push(date as never);
    data.datasets[0].data.push(grossNewSales as never);
  }

  return <Line data={data} options={options}></Line>;
};

const fetchDemandData = async () => {
  const response = await fetch("api/ddb/demandData");
  const data = await response.json();
  return data;
};

export default function DemandFeeds() {
  const [data, setData] = useState<any>([]);
  const [currCropDataIdx, setCurrCropDataIdx] = useState<number>(0);

  useEffect(() => {
    fetchDemandData().then((data) => setData(data.data));
  }, []);

  return (
    <Box mt="10">
      <Container maxW={"7xl"}>
        <Sidebar>
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              marginBottom="5"
            >
              <Heading size="lg">Demand feeds</Heading>
            </Flex>
            <Select
              size="sm"
              value={currCropDataIdx}
              onChange={(e) => setCurrCropDataIdx(Number(e.target.value))}
            >
              {data.map((d: any, idx: number) => {
                return (
                  <option key={idx} value={idx}>
                    {d.commodityName}
                  </option>
                );
              })}
            </Select>

            <Flex p="3%" flexDir="column" overflow="auto" minHeight="100vh">
              <Text color="gray" fontSize="md" marginBottom="3">
                {`Gross New Sales, Metric Tones`}
              </Text>
              <MyChart rawData={data} idx={currCropDataIdx} />
            </Flex>
          </Box>
        </Sidebar>
      </Container>
    </Box>
  );
}
