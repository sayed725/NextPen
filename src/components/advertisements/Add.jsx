import {
  FaMapMarkerAlt,
  FaSun,
  FaCloudShowersHeavy,
  FaBolt,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Add = () => {
  const date = new Date();
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  const today = date.toLocaleDateString("en-US", options);

  return (
    <Card className="bg-white dark:bg-[#20293d] dark:text-white">
      <CardContent className="px-5 text-start">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold border-b-2 border-[#005694] pb-1 w-[150px]">
            Advertisements
          </CardTitle>
        </CardHeader>

        <div className="flex flex-col gap-10 py-5">
          {/* Advertisement 1 */}
          <div>
            <img
              src="/add1.gif"
              alt="Advertisement"
              className="h-[300px] w-full object-contain lg:object-fill"
            />
          </div>

          {/* Weather Section */}
          <div>
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-semibold border-b-2 border-[#005694] pb-1 w-[150px]">
                Weather Today
              </CardTitle>
            </CardHeader>
            <div className="mx-auto bg-blue-500 text-white rounded-lg shadow-lg p-6 mt-5">
              <div className="text-center">
                <div className="text-6xl font-bold">71°</div>
                <FaSun className="text-5xl mx-auto my-2" />
                <div className="text-2xl">Sunny</div>
                <div className="text-sm mt-2">
                  Real Feel: 78° | Rain Chance: 5%
                </div>
              </div>
              <div className="flex justify-around lg:justify-between items-center mt-6">
                <div className="text-center">
                  <div>MON</div>
                  <FaSun className="text-2xl" />
                  <div>69°</div>
                </div>
                <div className="text-center">
                  <div>TUE</div>
                  <FaBolt className="text-2xl" />
                  <div>74°</div>
                </div>
                <div className="text-center">
                  <div>WED</div>
                  <FaCloudShowersHeavy className="text-2xl" />
                  <div>73°</div>
                </div>
                <div className="text-center">
                  <div>THU</div>
                  <FaSun className="text-2xl" />
                  <div>68°</div>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="text-lg">{today}</div>
                <div className="text-sm flex items-center justify-center mt-1">
                  <FaMapMarkerAlt className="mr-1" /> Los Angeles, CA
                </div>
              </div>
            </div>
          </div>

          {/* Advertisement 2 */}
          <div>
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-semibold border-b-2 border-[#005694] pb-1 w-[150px]">
                Advertisements
              </CardTitle>
            </CardHeader>
            <img
              src="/add2.jpg"
              alt="Advertisement"
              className="h-[300px] w-full object-contain mt-5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Add;