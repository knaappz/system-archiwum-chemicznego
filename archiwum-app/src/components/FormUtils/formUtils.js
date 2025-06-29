import moment from "moment";

// OBLICZANIE DATY WAZNOSCI
export const calculateEndDate = (startDate, period) => {
    if (!startDate || !period) return "";

    const periodMapping = {
        "7 dni": 7,
        "14 dni": 14,
        "1 mies": 30,
        "3 mies": 90,
        "6 mies": 180,
        "12 mies": 365,
        "24 mies": 730,
        "48 mies": 1460
    };

    const daysToAdd = periodMapping[period] || 0;
    return moment(startDate).add(daysToAdd, "days").format("YYYY-MM-DD");
};

// Funkcja obsługująca zmiany w formularzu
export const handleFormChange = (formData, setFormData, e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};