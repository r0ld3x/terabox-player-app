export function checkUrlPatterns(url: string): boolean {
  const patterns: RegExp[] = [
    /www\.nephobox\.com/,
    /freeterabox\.com/,
    /www\.freeterabox\.com/,
    /1024tera\.com/,
    /4funbox\.co/,
    /www\.4funbox\.com/,
    /mirrobox\.com/,
    /nephobox\.com/,
    /terabox\.app/,
    /terabox\.com/,
    /www\.terabox\.ap/,
    /www\.terabox\.com/,
    /www\.1024tera\.co/,
    /www\.momerybox\.com/,
    /teraboxapp\.com/,
    /momerybox\.com/,
    /tibibox\.com/,
    /www\.tibibox\.com/,
    /www\.teraboxapp\.com/,
    /www\.teraboxlink\.com/,
    /teraboxlink\.com/,
    /terasharelink\.com/,
  ];

  return patterns.some((pattern) => pattern.test(url));
}

export function replaceNetlocWithNewDomain(
  url: string,
  newDomain: string = "1024terabox.com"
): string {
  try {
    const urlObj = new URL(url);
    const netloc = urlObj.hostname;
    const newUrl = url.replace(netloc, newDomain);
    return newUrl;
  } catch (error) {
    return url;
  }
}
