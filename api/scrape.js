<!DOCTYPE html>
<html>
<head>
    <title>WSC F1 Scraper Test</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>F1 Results Scraper Test</h1>
    
    <form id="scrapeForm">
        <div>
            <label>Race: <input type="text" id="race" value="abu-dhabi-grand-prix" required></label>
        </div>
        <button type="submit">Fetch Results</button>
    </form>

    <h2>Results:</h2>
    <pre id="results">No results yet</pre>

    <script>
        document.getElementById('scrapeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const race = document.getElementById('race').value;
            
            try {
                const response = await fetch(`/api/scrape?race=${race}`);
                const data = await response.json();
                document.getElementById('results').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('results').textContent = `Error: ${error.message}`;
            }
        });
    </script>
</body>
</html>
