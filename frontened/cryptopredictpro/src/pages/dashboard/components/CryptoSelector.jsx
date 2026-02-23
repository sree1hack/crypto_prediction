import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CryptoSelector = ({ selectedCrypto, onCryptoChange, loading }) => {
  const cryptoOptions = [
    { 
      value: 'DOGE', 
      label: 'Dogecoin (DOGE)',
      description: 'The meme cryptocurrency'
    },
    { 
      value: 'XRP', 
      label: 'Ripple (XRP)',
      description: 'Digital payment protocol'
    },
    { 
      value: 'MATIC', 
      label: 'Polygon (MATIC)',
      description: 'Ethereum scaling solution'
    },
    { 
      value: 'BTC', 
      label: 'Bitcoin (BTC)',
      description: 'The original cryptocurrency'
    },
    { 
      value: 'ETH', 
      label: 'Ethereum (ETH)',
      description: 'Smart contract platform'
    },
    { 
      value: 'LTC', 
      label: 'Litecoin (LTC)',
      description: 'Digital silver to Bitcoin\'s gold'
    },
    { 
      value: 'BCH', 
      label: 'Bitcoin Cash (BCH)',
      description: 'Bitcoin fork with larger blocks'
    },
    { 
      value: 'BNB', 
      label: 'Binance Coin (BNB)',
      description: 'Binance exchange token'
    },
    { 
      value: 'DOT', 
      label: 'Polkadot (DOT)',
      description: 'Multi-chain protocol'
    },
    { 
      value: 'LINK', 
      label: 'Chainlink (LINK)',
      description: 'Decentralized oracle network'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
          <Icon name="Coins" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Select Cryptocurrency</h3>
          <p className="text-sm text-muted-foreground">Choose the crypto asset to predict</p>
        </div>
      </div>
      <Select
        label="Cryptocurrency"
        placeholder="Select a cryptocurrency"
        options={cryptoOptions}
        value={selectedCrypto}
        onChange={onCryptoChange}
        disabled={loading}
        searchable
        className="w-full"
      />
      {selectedCrypto && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center">
            <Icon name="Info" size={16} color="var(--color-muted-foreground)" className="mr-2" />
            <span className="text-sm text-muted-foreground">
              Selected: {cryptoOptions?.find(option => option?.value === selectedCrypto)?.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoSelector;