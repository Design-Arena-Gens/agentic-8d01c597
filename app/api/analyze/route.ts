import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, description, category, price } = await req.json();

    // AI-powered analysis
    const keywords = generateKeywords(title, description, category);
    const suggestions = generateSuggestions(title, description, price, category);
    const optimizedTitle = optimizeTitle(title, keywords);
    const optimizedDescription = optimizeDescription(description, keywords);

    return NextResponse.json({
      keywords,
      suggestions,
      optimizedTitle,
      optimizedDescription,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}

function generateKeywords(title: string, description: string, category: string): string[] {
  const text = `${title} ${description} ${category}`.toLowerCase();
  const keywords: string[] = [];

  // Common marketplace keywords
  const marketplaceKeywords = [
    'brand new', 'नया', 'original', 'authentic', 'warranty',
    'best price', 'सस्ता', 'discount', 'sale', 'urgent',
    'excellent condition', 'like new', 'barely used',
    'fast delivery', 'home delivery', 'cash on delivery',
  ];

  // Category-specific keywords
  const categoryKeywords: { [key: string]: string[] } = {
    electronics: ['smartphone', 'mobile', 'phone', 'laptop', 'computer', 'gaming', 'टेक्नोलॉजी'],
    furniture: ['घर', 'home', 'wooden', 'premium', 'designer', 'sofa', 'bed', 'table'],
    fashion: ['branded', 'designer', 'clothes', 'कपड़े', 'shoes', 'जूते', 'accessories'],
    vehicles: ['car', 'bike', 'scooter', 'गाड़ी', 'well maintained', 'single owner'],
  };

  // Add relevant marketplace keywords
  marketplaceKeywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      keywords.push(keyword);
    }
  });

  // Add category-specific keywords
  Object.entries(categoryKeywords).forEach(([cat, words]) => {
    if (category.toLowerCase().includes(cat) || text.includes(cat)) {
      words.forEach(word => {
        if (text.includes(word.toLowerCase())) {
          keywords.push(word);
        }
      });
    }
  });

  // Extract brand names (common brands)
  const brands = [
    'iPhone', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo',
    'Sony', 'LG', 'HP', 'Dell', 'Lenovo', 'Apple', 'Nike', 'Adidas',
    'Puma', 'Ikea', 'Godrej', 'Nilkamal', 'Honda', 'Hero', 'Bajaj'
  ];

  brands.forEach(brand => {
    if (text.includes(brand.toLowerCase())) {
      keywords.push(brand);
    }
  });

  // Add generic powerful keywords if list is short
  if (keywords.length < 5) {
    keywords.push('best deal', 'limited offer', 'सर्वोत्तम', 'quality product', 'trusted seller');
  }

  return [...new Set(keywords)].slice(0, 10);
}

function generateSuggestions(
  title: string,
  description: string,
  price: string,
  category: string
): string[] {
  const suggestions: string[] = [];

  // Title suggestions
  if (title.length < 20) {
    suggestions.push('शीर्षक में अधिक विवरण जोड़ें - कम से कम 20 characters होने चाहिए');
  }
  if (!/\d/.test(title) && category.toLowerCase().includes('electronic')) {
    suggestions.push('शीर्षक में model number या specifications जोड़ें (जैसे: 256GB, 8GB RAM)');
  }

  // Description suggestions
  if (description.length < 50) {
    suggestions.push('विवरण को और विस्तृत बनाएं - खरीदारों को पूरी जानकारी चाहिए');
  }
  if (!description.toLowerCase().includes('condition') && !description.toLowerCase().includes('स्थिति')) {
    suggestions.push('Product की condition स्पष्ट रूप से बताएं (नया/पुराना/जैसा नया)');
  }
  if (!description.toLowerCase().includes('warranty') && !description.toLowerCase().includes('गारंटी')) {
    suggestions.push('Warranty की जानकारी दें अगर उपलब्ध है');
  }

  // Price suggestions
  if (!price || price === '0') {
    suggestions.push('स्पष्ट कीमत लिखें - खरीदार हमेशा कीमत देखना चाहते हैं');
  }
  if (price && parseInt(price.replace(/[^\d]/g, '')) > 10000) {
    suggestions.push('महंगे सामान के लिए negotiation की possibility बताएं');
  }

  // Photos suggestion (always relevant)
  suggestions.push('📸 कम से कम 5-6 clear photos लगाएं - सभी angles से');

  // Location suggestion
  suggestions.push('📍 अपना सही location दें ताकि local buyers आसानी से संपर्क कर सकें');

  // Urgency suggestion
  if (!title.toLowerCase().includes('urgent') && !description.toLowerCase().includes('urgent')) {
    suggestions.push('अगर जल्दी बेचना है तो "Urgent Sale" या "Limited Time" जोड़ें');
  }

  // Response time
  suggestions.push('⚡ Messages का जल्दी जवाब दें - responsive sellers को ज्यादा buyers मिलते हैं');

  return suggestions.slice(0, 8);
}

function optimizeTitle(title: string, keywords: string[]): string {
  let optimized = title;

  // Add urgent tag if not present
  if (!title.toLowerCase().includes('urgent') && !title.toLowerCase().includes('sale')) {
    optimized = `${optimized} - Best Deal`;
  }

  // Add top keyword if space available
  if (optimized.length < 60 && keywords.length > 0) {
    const topKeyword = keywords.find(k => !optimized.toLowerCase().includes(k.toLowerCase()));
    if (topKeyword) {
      optimized = `${optimized} | ${topKeyword}`;
    }
  }

  return optimized.substring(0, 100);
}

function optimizeDescription(description: string, keywords: string[]): string {
  let optimized = description;

  // Add call to action at the end
  if (!optimized.toLowerCase().includes('contact') && !optimized.toLowerCase().includes('संपर्क')) {
    optimized += '\n\n📞 Interested buyers can contact immediately. Serious buyers only!';
    optimized += '\n✅ Home delivery available';
    optimized += '\n💯 100% genuine product';
  }

  // Add keywords naturally if not present
  const missingKeywords = keywords.filter(k =>
    !optimized.toLowerCase().includes(k.toLowerCase())
  ).slice(0, 3);

  if (missingKeywords.length > 0) {
    optimized += `\n\n🏷️ Tags: ${missingKeywords.join(', ')}`;
  }

  return optimized;
}
