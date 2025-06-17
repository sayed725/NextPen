import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Add2 = () => {
  return (
    <Card className="bg-white mb-2 dark:bg-[#20293d] dark:text-white">
      <CardContent className="px-5 text-start">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold border-b-2 border-[#005694] pb-1 w-[150px]">
            Advertisements
          </CardTitle>
        </CardHeader>

        <div className="flex flex-col gap-10 py-5">
          <div>
            <img
              src="/ad-widget.gif"
              alt="Advertisement"
              className="h-[300px] w-full object-contain lg:object-fill"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Add2;