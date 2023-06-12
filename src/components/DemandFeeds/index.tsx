import {
  Box,
  Container,
  Flex,
  Heading,
  Select,
  useToast,
} from "@chakra-ui/react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Filler,
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
  Legend,
  Filler
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

  const currCropData = rawData[idx].data;

  const data = {
    labels: currCropData.map((d) => d.date),
    datasets: [
      {
        fill: {
          target: "origin",
          above: "rgba(72, 187, 120, 0.3)",
        },
        backgroundColor: "rgb(72, 187, 120)",
        borderColor: "rgb(72, 187, 120)",
        pointRadius: 4,
        pointHoverBorderWidth: 4,
        tension: 0.4,
        pointHoverBackgroundColor: "rgb(72, 187, 120)",
        pointHoverBorderColor: "rgb(72, 187, 120)",
        data: currCropData.map((d) => d.grossNewSales),
      },
    ],
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

  return <Line data={data} options={options}></Line>;
};

const fetchDemandData = async () => {
  try {
    const response = await fetch("api/ddb/demandData");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error occurred while fetching demand data:", error);
  }
};

export default function DemandFeeds() {
  const [data, setData] = useState<any>([]);
  const [currCropDataIdx, setCurrCropDataIdx] = useState<number>(0);
  const toast = useToast();

  useEffect(() => {
    fetchDemandData()
      .then((data) => setData(data.data))
      .catch(() => {
        toast({
          title: "Error fetching demand data",
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      });
  }, []);

  if (!data || !data.length) return null;

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
              focusBorderColor="rgb(226, 232, 240)"
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
              <Flex
                flexDir="column"
                color="gray"
                fontWeight={700}
                fontSize="md"
                marginBottom="10"
              >
                Gross New Sales,
                <Flex>Metric Tones</Flex>
              </Flex>
              <MyChart rawData={data} idx={currCropDataIdx} />
            </Flex>
          </Box>
        </Sidebar>
      </Container>
    </Box>
  );
}
