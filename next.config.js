/** @type {import('next').NextConfig} */

const parseNotionConfig = (pages) => {
  const TEXT_TYPES = ['Site', 'Theme', 'Shop'];
  const DB_TYPES = ['Database'];
  const config = {};
  pages.forEach((result) => {
    let key = null;
    let value = null;
    let type = null;

    const properties = result.properties;

    // Get the key key value
    key = properties.Key.rich_text[0]?.plain_text;
    // Get the type for parse correct data
    type = properties.Type.select.name;

    // Now can get the corrent value object
    const value_data = properties.Value;

    if (TEXT_TYPES.includes(type)) {
      value = value_data?.rich_text[0]?.plain_text;
    }

    if (DB_TYPES.includes(type)) {
      value = value_data?.rich_text[0]?.href.replace('/', '');
    }

    if (key && value) {
      config[key] = value;
    }
  });

  return config;
};

const nextConfig = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  serverRuntimeConfig: {
    notion_api_token: process.env.NEXT_NOTION_API_SECRET,
    notion_config_db: process.env.NOTION_GLOBAL_CONFIG_DB,

    //TODO: Create an async server config that fetch data from notion
    calendarOptions: {
      slotSize: 15, // Slot size in minutes
    },
    tijaConfig: (async () => {
      const { Client } = await import('@notionhq/client');
      const notion = new Client({ auth: process.env.NEXT_NOTION_API_SECRET });
      const response = await notion.databases.query({
        database_id: process.env.NOTION_GLOBAL_CONFIG_DB,
        sorts: [
          {
            property: 'Type',
            direction: 'ascending',
          },
        ],
      });

      if (response.results && Array.isArray(response.results)) {
        const config = parseNotionConfig(response?.results);
        return config;
      }
      return null;
    })(),
  },

  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
