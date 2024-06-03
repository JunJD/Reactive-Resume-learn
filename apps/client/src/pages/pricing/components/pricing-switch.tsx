import { Tabs, TabsList, TabsTrigger } from "@reactive-resume/ui";

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="mx-auto w-40" onValueChange={onSwitch}>
    <TabsList className="px-2 py-6">
      <TabsTrigger value="0" className="text-base">
        按月付
      </TabsTrigger>
      <TabsTrigger value="1" className="text-base">
        按年付
      </TabsTrigger>
    </TabsList>
  </Tabs>
);
export default PricingSwitch;
