const GOOGLE_MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31078.361591144112!2d-74.0256365664179!3d40.705584751235754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1724572184688!5m2!1sen!2sbd";

/** Minimal sandbox for Google Maps embeds (scripts + popups, no same-origin escape). */
const MAP_EMBED_SANDBOX = "allow-scripts allow-popups allow-popups-to-escape-sandbox";

type GoogleMapsEmbedProps = {
  title: string;
  width?: number | string;
  height?: number | string;
};

const GoogleMapsEmbed = ({
  title,
  width = 600,
  height = 450,
}: GoogleMapsEmbedProps) => (
  <iframe
    src={GOOGLE_MAPS_EMBED_SRC}
    title={title}
    sandbox={MAP_EMBED_SANDBOX}
    width={width}
    height={height}
    style={{ border: 0 }}
    loading="lazy"
  />
);

export default GoogleMapsEmbed;
