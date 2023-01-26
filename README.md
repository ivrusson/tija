# Tija - A Next.js App for Appointment Management

Tija is a web application built with [Next.js](https://nextjs.org/) that allows users to easily and efficiently manage their appointments. It uses [Notion](https://www.notion.com/) as a backend for storing and organizing appointments.

## Tija Docs

Learn more about [Tija](https://ivrusson.notion.site/Tija-38ca18ea7c16439fab623b3349171fd1) Project in Notion.

## Notion template

You can clone the template form here: https://ivrusson.notion.site/Tija-Base-Template-50d2e0825c87423f9a583f1a8fad8c49

## Web Features

- Integration with Notion for storage and organization
- Custom theme using configuration extracted from notion
- Show your events list
- Take bookings from your next app

## Notion features

- Notion as Database: Bookings, Customers, Events, Working Plans, and more...
- View appointments in a calendar
- Control your "Customers"
- Manage your schedule availability with "Working Plans"
- Manage your events

### TO DO

- [] Payment system with Stripe/SquareUp
- [] Improve template customization

## Installation

1. Clone this repository

```
git clone https://github.com/ivrusson/tija.git
```

2. Install dependencies

```
npm install
```

3. Start the development server

```
npm run dev
```

4. Visit http://localhost:3000 in your browser to view the application.

## Configuration

Before using Tija, you must set up a connection to your Notion account. This can be done by creating a [Notion API key](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration) and adding it to the `.env.local` file.

## Thanks & Acknowledgements

I would like to thank to [Theodorus Clarence](https://theodorusclarence.com/) for providing the [Next.js + Tailwind CSS + TypeScript starter](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter) which served as a foundation for this project. The starter is packed with useful development features and made the development process much smoother.

## License

Tija is available under the [MIT](https://github.com/%3Cusername%3E/tija/blob/master/LICENSE) license.
