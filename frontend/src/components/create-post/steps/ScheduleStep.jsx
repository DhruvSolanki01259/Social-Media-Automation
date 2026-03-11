import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, BrainCircuit, Check } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.25 },
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const ScheduleStep = ({ postData, setPostData }) => {
  const today = new Date();

  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleType, setScheduleType] = useState("manual");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const calendarRef = useRef(null);
  const timeRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const years = [];
  for (let i = today.getFullYear(); i <= today.getFullYear() + 10; i++) {
    years.push(i);
  }

  /* ---------------- CLICK OUTSIDE ---------------- */

  useEffect(() => {
    const handler = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(e.target)) {
        setTimeOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- AUTO POST WHEN NOT SCHEDULED ---------------- */

  useEffect(() => {
    if (!scheduleEnabled) {
      const now = new Date();
      const autoTime = new Date(now.getTime() + 5 * 60000);

      const date = formatLocalDate(autoTime);
      const h = String(autoTime.getHours()).padStart(2, "0");
      const m = String(autoTime.getMinutes()).padStart(2, "0");

      setPostData((prev) => ({
        ...prev,
        isScheduled: false,
        scheduledAt: {
          type: "auto",
          date,
          time: `${h}:${m}`,
        },
      }));
    }
  }, [scheduleEnabled, setPostData]);

  /* ---------------- CALENDAR ---------------- */

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const isPastDate = (date) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return date < start;
  };

  /* ---------------- UPDATE SCHEDULE ---------------- */

  const updateSchedule = (date, h, m) => {
    if (!date || !h || !m) return;

    const selected = new Date(date);
    selected.setHours(h, m);

    if (selected < new Date()) return;

    setPostData((prev) => ({
      ...prev,
      isScheduled: true,
      scheduledAt: {
        type: "manual",
        date: formatLocalDate(date),
        time: `${h}:${m}`,
      },
    }));
  };

  const handleDateSelect = (date) => {
    if (isPastDate(date)) return;

    setSelectedDate(date);
    setCalendarOpen(false);

    updateSchedule(date, hour, minute);
  };

  const handleHourChange = (h) => {
    setHour(h);
    if (minute) {
      updateSchedule(selectedDate, h, minute);
      setTimeOpen(false);
    }
  };

  const handleMinuteChange = (m) => {
    setMinute(m);
    if (hour) {
      updateSchedule(selectedDate, hour, m);
      setTimeOpen(false);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const minutes = ["00", "15", "30", "45"];

  const isPastTime = (h, m) => {
    if (!selectedDate) return false;

    const now = new Date();
    const selected = new Date(selectedDate);

    selected.setHours(h);
    selected.setMinutes(m);

    return selected < now;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* TITLE */}

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#013A63] dark:text-[#CBE5F5]">
          Schedule Your Post
        </h2>
      </div>

      {/* TOGGLE */}

      <div className="p-5 border rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            Schedule this post
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Publish automatically at a chosen time
          </p>
        </div>

        <button
          onClick={() => setScheduleEnabled(!scheduleEnabled)}
          className={`relative w-12 h-6 rounded-full transition ${
            scheduleEnabled ? "bg-[#2A6F97]" : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          <motion.div
            layout
            className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white flex items-center justify-center"
            animate={{ x: scheduleEnabled ? 22 : 0 }}
          >
            {scheduleEnabled && <Check size={12} />}
          </motion.div>
        </button>
      </div>

      {/* AUTO POST MESSAGE */}

      {!scheduleEnabled && (
        <motion.div
          {...fadeUp}
          className="p-5 rounded-xl border border-[#D6E6F2] dark:border-gray-700
          bg-[#F5FAFD] dark:bg-gray-900"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your post will automatically publish in about
            <span className="font-semibold"> 5 minutes</span>.
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Scheduling helps reach audiences at the best engagement time.
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {scheduleEnabled && (
          <motion.div {...fadeUp} className="space-y-6">
            {/* TYPE SWITCH */}

            <div className="flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setScheduleType("manual")}
                className={`w-1/2 py-3 flex items-center justify-center gap-2 ${
                  scheduleType === "manual"
                    ? "bg-[#2A6F97] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Calendar size={16} />
                Manual
              </button>

              <button
                onClick={() => setScheduleType("analytical")}
                className={`w-1/2 py-3 flex items-center justify-center gap-2 ${
                  scheduleType === "analytical"
                    ? "bg-[#2A6F97] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <BrainCircuit size={16} />
                AI Smart Time
              </button>
            </div>

            {/* MANUAL */}

            {scheduleType === "manual" && (
              <motion.div
                {...fadeUp}
                className="grid sm:grid-cols-2 gap-5 p-6 rounded-xl
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900"
              >
                {/* DATE PICKER */}

                <div className="relative" ref={calendarRef}>
                  <label className="text-sm flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                    <Calendar size={16} />
                    Date
                  </label>

                  <button
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className="w-full border border-gray-300 dark:border-gray-600
                    rounded-lg px-4 py-3
                    bg-gray-50 dark:bg-gray-800
                    text-gray-800 dark:text-gray-200 text-left"
                  >
                    {selectedDate
                      ? formatDate(selectedDate)
                      : "Choose publishing date"}
                  </button>

                  {calendarOpen && (
                    <div
                      className="absolute z-20 mt-2 p-4 w-72 rounded-xl
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-900 shadow-lg"
                    >
                      <div className="flex gap-2 mb-4">
                        <select
                          value={month}
                          onChange={(e) => setMonth(Number(e.target.value))}
                          className="flex-1 p-2 rounded border
                          bg-white dark:bg-gray-800
                          border-gray-300 dark:border-gray-600
                          text-gray-800 dark:text-gray-200"
                        >
                          {months.map((m, i) => (
                            <option key={i} value={i}>
                              {m}
                            </option>
                          ))}
                        </select>

                        <select
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          className="flex-1 p-2 rounded border
                          bg-white dark:bg-gray-800
                          border-gray-300 dark:border-gray-600
                          text-gray-800 dark:text-gray-200"
                        >
                          {years.map((y) => (
                            <option key={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-7 gap-2 text-sm">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <div
                            key={d}
                            className="text-center text-gray-400 dark:text-gray-500"
                          >
                            {d}
                          </div>
                        ))}

                        {calendarDays.map((date, i) => {
                          if (!date) return <div key={i} />;

                          const disabled = isPastDate(date);

                          return (
                            <button
                              key={i}
                              disabled={disabled}
                              onClick={() => handleDateSelect(date)}
                              className={`p-2 rounded-md transition
                              ${
                                disabled
                                  ? "text-gray-300 dark:text-gray-600"
                                  : "hover:bg-[#2A6F97] hover:text-white"
                              }`}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* TIME PICKER */}

                <div className="relative" ref={timeRef}>
                  <label className="text-sm flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                    <Clock size={16} />
                    Time
                  </label>

                  <button
                    onClick={() => setTimeOpen(!timeOpen)}
                    className="w-full border border-gray-300 dark:border-gray-600
                    rounded-lg px-4 py-3
                    bg-gray-50 dark:bg-gray-800
                    text-gray-800 dark:text-gray-200 text-left"
                  >
                    {hour && minute
                      ? `${hour}:${minute}`
                      : "Choose publishing time"}
                  </button>

                  {timeOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 z-20 w-full
                    rounded-xl border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-900 shadow-xl"
                    >
                      <div className="flex divide-x dark:divide-gray-700">
                        <div className="w-1/2 max-h-56 overflow-y-auto">
                          {hours.map((h) => {
                            const disabled = isPastTime(h, minute || "00");

                            return (
                              <button
                                key={h}
                                disabled={disabled}
                                onClick={() => handleHourChange(h)}
                                className={`w-full px-4 py-2 text-left
                                ${
                                  disabled
                                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                    : "hover:bg-[#2A6F97] hover:text-white"
                                }
                                ${
                                  hour === h
                                    ? "bg-[#2A6F97] text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {h}
                              </button>
                            );
                          })}
                        </div>

                        <div className="w-1/2 max-h-56 overflow-y-auto">
                          {minutes.map((m) => {
                            const disabled = isPastTime(hour || "00", m);

                            return (
                              <button
                                key={m}
                                disabled={disabled}
                                onClick={() => handleMinuteChange(m)}
                                className={`w-full px-4 py-2 text-left
                                ${
                                  disabled
                                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                    : "hover:bg-[#2A6F97] hover:text-white"
                                }
                                ${
                                  minute === m
                                    ? "bg-[#2A6F97] text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                :{m}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* AI SMART */}

            {scheduleType === "analytical" && (
              <motion.div
                {...fadeUp}
                className="p-6 rounded-xl text-center
                border border-[#D6E6F2] dark:border-gray-700
                bg-gradient-to-br
                from-[#EAF4FB] to-[#F5FAFD]
                dark:from-gray-900 dark:to-gray-800"
              >
                <BrainCircuit
                  size={32}
                  className="mx-auto text-[#2A6F97] mb-3"
                />

                <h3 className="text-lg font-semibold text-[#013A63] dark:text-[#CBE5F5]">
                  AI Smart Scheduling
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
                  Our system will automatically determine the best time to post
                  based on engagement analytics, audience activity, and past
                  performance data.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduleStep;
