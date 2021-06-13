import { performance } from "perf_hooks";

type MessageCreator = (data: {
  className: string;
  durationInNs: string;
  durationInMs: string;
  avergageInMs: string;
}) => string;

const defaultMessageCreator: MessageCreator = ({
  className,
  durationInNs,
  durationInMs,
  avergageInMs,
}) =>
  `${
    className || "unknown"
  } took ${durationInNs}μs (${durationInMs}ms) avg ${avergageInMs}ms`;

const averages: AnyObject = {};

export function Measure(
  logger: Function,
  prefix?: string,
  messageCreator: MessageCreator = defaultMessageCreator
): any {
  return (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const originalMethod = descriptor.value as Function;
    const functionName = originalMethod.name ? originalMethod.name : prefix;

    // eslint-disable-next-line func-names
    descriptor.value = function <R>(...args: unknown[]): Promise<R> {
      const className =
        (this as any).name ||
        (this && this.constructor && this.constructor.name);

      if (className.endsWith("Controller")) {
        logger(
          `The measurement for "${functionName}" in "${className}" can create unwanted side-effects, especially with other method decorators, proceed with caution!`
        );
      }

      const start = performance.now() * 1e3;
      try {
        return originalMethod.apply(this, args);
      } catch (caught) {
        throw caught;
      } finally {
        const finish = performance.now() * 1e3;

        const durationInNs = finish - start;
        const durationInMs = durationInNs / 1e3;

        const avgEntry = averages[`${functionName}${prefix}`];

        averages[`${functionName}${prefix}`] = {
          callCount: avgEntry ? avgEntry.callCount + 1 : 1,
          totalTime: avgEntry
            ? avgEntry.totalTime + durationInNs
            : durationInNs,
        };

        const updatedAvgEntry = averages[`${functionName}${prefix}`];

        const averageInMs =
          updatedAvgEntry.totalTime / updatedAvgEntry.callCount / 1e3;

        logger(
          [
            prefix,
            messageCreator({
              className,
              durationInNs: durationInNs.toFixed(2),
              durationInMs: durationInMs.toFixed(4),
              avergageInMs: averageInMs.toFixed(4),
            }),
          ].join(" ")
        );
      }
    };
  };
}
