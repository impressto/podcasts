# Deployment Examples

This directory contains examples for deploying the podcast player in different environments.

## PHP Deployment

If you're hosting the application through a PHP file, use the following files as references:

- `podcasts.php`: A sample PHP wrapper for the player
- `tracks.json`: Sample track configuration

### Steps for PHP Deployment:

1. Configure your environment:
   - Copy `.env.example` to `.env`
   - Set the tracks URL: `VITE_APP_IMPRESSTO_TRACKS_URL=https://your-domain.com/path/to/tracks.json`

2. Build the project:
   ```bash
   npm run build
   ```

3. Copy the contents of the `dist` directory to your server

4. Adjust the CSS and JavaScript paths in `podcasts.php` to match your actual build filenames

5. Place the `tracks.json` file at the location specified in your environment variable:

   - For impressto.ca (default): `https://impressto.ca/podcasts/public/tracks.json`
   - For other deployments: The location you specified in the `.env` file

6. Access your player at `https://your-domain.com/podcasts.php`

7. You can use URL hash parameters to auto-select tracks:
   - `https://your-domain.com/podcasts.php#track-1`
   - `https://your-domain.com/podcasts.php#private-1`

## Troubleshooting

If you see the error `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`:

1. Make sure `tracks.json` is in the same directory as your PHP file
2. Verify that the JSON syntax in `tracks.json` is valid
3. Check that the file permissions allow the web server to read `tracks.json`
4. Use browser developer tools (Network tab) to see where the app is trying to load `tracks.json` from
