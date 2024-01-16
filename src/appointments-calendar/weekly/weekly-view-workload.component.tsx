import React from "react";
import classNames from "classnames";
import dayjs, { type Dayjs } from "dayjs";
import { navigate, useLayoutType } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";

import { spaBasePath } from "../../constants";
import { isSameMonth } from "../../helpers";
import { type CalendarType } from "../../types";
import styles from "./weekly-workload-module.scss";

interface WeeklyCellProps {
  type: CalendarType;
  dateTime: Dayjs;
  currentDate: Dayjs;
  events: Array<any>;
  index?: number;
}

const WeeklyWorkloadView: React.FC<WeeklyCellProps> = ({
  type,
  dateTime,
  currentDate,
  events,
  index,
}) => {
  const layout = useLayoutType();
  const currentData = events?.find(
    (event) =>
      dayjs(event.appointmentDate).format("YYYY-MM-DD") ===
      dayjs(dateTime).format("YYYY-MM-DD"),
  );
  const colorCoding = { HIV: "red", "Lab testing": "purple", Refill: "blue" };
  const { t } = useTranslation();

  return (
    <div
      className={
        styles[
          type === "weekly"
            ? "weekly-cell"
            : isSameMonth(dateTime, currentDate)
              ? "monthly-cell"
              : "monthly-cell-disabled"
        ]
      }
    >
      {type === "weekly" ? (
        <>
          <div className={styles.allDayComponent}>
            <small className={styles.allDay}>All Day</small>
            {index !== 0 && currentData?.service && (
              <div className={styles.currentData}>
                {currentData?.service.map(({ serviceName, count }, index) => (
                  <div
                    className={classNames(
                      styles.serviceArea,
                      styles[colorCoding[serviceName]],
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      navigate({
                        to: `${spaBasePath}/appointments/list/${dateTime}/${serviceName}`,
                      })
                    }
                    key={serviceName}
                  >
                    <span>{serviceName}</span>
                    <span>{count}</span>
                  </div>
                ))}
                <div
                  className={classNames(styles.serviceArea, styles.green)}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate({
                      to: `${spaBasePath}/appointments/list/${dateTime}/Total`,
                    })
                  }
                >
                  <span>{t("total", "Total")}</span>
                  <span>
                    {currentData?.service.reduce(
                      (sum, currentValue) => sum + currentValue?.count ?? 0,
                      0,
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
export default WeeklyWorkloadView;
