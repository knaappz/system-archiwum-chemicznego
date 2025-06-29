const InneSelect = ({ value, onChange }) => {
    const handleChange = (e) => {
        const { value } = e.target;
        onChange({
            target: {
                name: 'nazwa',
                value: value,
            }
        });
    };

    return (
        <>
            Wpisz nazwę substancji:
            <input
                type="text"
                name="nazwa"
                value={value}
                onChange={handleChange}
                placeholder="Wpisz nazwę substancji..."
                required
            />

        </>
    );
};

export default InneSelect;
