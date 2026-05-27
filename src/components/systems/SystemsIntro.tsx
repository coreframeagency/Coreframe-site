import { Reveal } from "@/components/ui/Reveal";
import { SERVICE_LAYERS } from "./constants";

export function SystemsIntro() {
  return (
    <div className="systems-intro">
      {SERVICE_LAYERS.map((layer, index) => (
        <Reveal key={layer.title} delay={index * 100}>
          <div className="systems-intro__column">
            <h2 className="systems-intro__title">{layer.title}</h2>
            <p className="systems-intro__body">{layer.description}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
