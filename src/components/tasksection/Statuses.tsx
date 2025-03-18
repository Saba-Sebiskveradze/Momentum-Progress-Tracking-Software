import { useEffect, useState } from "react";
import { getStatuses } from "../../api/data";

interface Status {
  id: number;
  name: string;
}

const Statuses = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await getStatuses();
        if (data && Array.isArray(data)) {
          setStatuses(data);
        } else {
          setError("Invalid data format");
        }
      } catch {
        setError("Failed to fetch statuses");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center mx-[120px] mt-[80px]"></div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center mx-[120px] mt-[80px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mx-[120px] mt-[80px]">
      {statuses.map((status) => {
        let backgroundColor = "";

        switch (status.id) {
          case 1:
            backgroundColor = "#F7BC30";
            break;
          case 2:
            backgroundColor = "#FB5607";
            break;
          case 3:
            backgroundColor = "#FF006E";
            break;
          case 4:
            backgroundColor = "#3A86FF";
            break;
          default:
            backgroundColor = "#FFFFFF"; 
        }

        return (
          <div
            key={status.id}
            className="w-[381px] h-[54px] flex items-center justify-center rounded-[10px] text-[#FFFFFF] firaGO-font text-[500] text-[20px]"
            style={{ backgroundColor }}
          >
            {status.name}
          </div>
        );
      })}
    </div>
  );
};

export default Statuses;
