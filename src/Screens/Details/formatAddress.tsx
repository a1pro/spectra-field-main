export const formatAddress = (details: {
    street?: string | boolean;
    street2?: string | boolean;
    zip?: string | boolean;
    city?: string | boolean;
    state_id?: string | boolean;
    country_id?: string | boolean;
  }): string => {
    const addressComponents = [
      details.street || '',
      details.street2 || '',
      details.city || '',
      details.state_id || '',
      details.zip || '',
      details.country_id || ''
    ];
  
    return addressComponents?.filter(item => item && typeof item === 'string').join(', ');
  };