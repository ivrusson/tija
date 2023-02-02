/** @type {import('next').NextConfig} */

const env = process.env.NODE_ENV || 'development';

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

const fechNotionGlobalDatabase = async () => {
  try {
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
    return response;
  } catch (e) {
    return {};
  }
}

const fechAutomationsDatabase = async (databaseId) => {
  try {
    const { Client } = await import('@notionhq/client');
    const notion = new Client({ auth: process.env.NEXT_NOTION_API_SECRET });
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Database',
          direction: 'ascending',
        },
      ],
    });
    return response;
  } catch (e) {
    return {};
  }
}

const getAutomationsConfig = async (databaseId) => {
  // This helps to solve testing problems with jest
  if (env === 'test') {
    return {};
  }

  const response = await fechAutomationsDatabase(databaseId);

  if (response.results && Array.isArray(response.results)) {
    const automations = {};
    for (let i = 0; i < response.results.length; i++) {
      const result = response.results[i];
      const databaseName = result.properties?.Database?.select?.name || '';
      const action = result.properties?.Action?.select?.name ? result.properties.Action.select.name.toLowerCase().replace(' ', '-') : '';
      const webhook = result.properties.Webhook?.url || '';
      automations[`${databaseName}:${action}`] = webhook
    }
    return automations;
  }

  return {};
}

const getTijaConfig = async () => {

  // This helps to solve testing problems with jest
  if (env === 'test') {
    return {};
  }

  const response = await fechNotionGlobalDatabase();

  if (response.results && Array.isArray(response.results)) {
    const config = parseNotionConfig(response?.results);
    if (config.DB_AUTOMATIONS) {
      const automations = await getAutomationsConfig(config.DB_AUTOMATIONS);
      return {
        ...config,
        automations,
      };
    }
    return config;
  }

  return {};
};

module.exports = async () => ({
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  serverRuntimeConfig: {
    notionConfig: {
      notionApiToken: process.env.NEXT_NOTION_API_SECRET,
      notionConfigDb: process.env.NOTION_GLOBAL_CONFIG_DB,
    },
    //TODO: Create an async server config that fetch data from notion
    tijaConfig: await getTijaConfig(),
  },

  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

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
});
