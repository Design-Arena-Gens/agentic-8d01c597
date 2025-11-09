import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, listingData, analysis } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Generate AI response based on conversation context
    const response = generateAIResponse(
      lastMessage.content,
      messages,
      listingData,
      analysis
    );

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Chat failed' },
      { status: 500 }
    );
  }
}

function generateAIResponse(
  userMessage: string,
  history: Message[],
  listingData: any,
  analysis: any
): string {
  const lowerMessage = userMessage.toLowerCase();

  // Keyword suggestions query
  if (
    lowerMessage.includes('keyword') ||
    lowerMessage.includes('tag') ||
    lowerMessage.includes('टैग') ||
    lowerMessage.includes('कीवर्ड')
  ) {
    return `📌 **आपकी listing के लिए सबसे अच्छे keywords:**

${analysis.keywords.map((k: string, i: number) => `${i + 1}. ${k}`).join('\n')}

**इन keywords को कैसे इस्तेमाल करें:**
• Title में main keywords जोड़ें (जैसे brand name, model)
• Description में naturally सभी keywords शामिल करें
• Facebook tags/categories में भी ये keywords डालें
• Photos के captions में भी keywords का इस्तेमाल करें

क्या आप किसी specific keyword के बारे में और जानना चाहते हैं?`;
  }

  // Title optimization query
  if (
    lowerMessage.includes('title') ||
    lowerMessage.includes('शीर्षक') ||
    lowerMessage.includes('heading')
  ) {
    return `✍️ **बेहतर Title के लिए सुझाव:**

**आपका current title:** ${listingData.title}

**Optimized title:**
${analysis.optimizedTitle}

**Title में ये चीज़ें ज़रूर रखें:**
1. Product का सटीक नाम
2. Brand और model number
3. Main features (जैसे: 256GB, Brand New)
4. Condition (New/Like New/Used)
5. USP (Unique Selling Point)

**Tips:**
• 50-80 characters ideal हैं
• Numbers और specifications ज़रूर दें
• All caps से बचें
• Emojis कम इस्तेमाल करें (1-2 max)`;
  }

  // Description optimization query
  if (
    lowerMessage.includes('description') ||
    lowerMessage.includes('विवरण') ||
    lowerMessage.includes('details')
  ) {
    return `📝 **बेहतर Description के लिए:**

**Optimized description:**
${analysis.optimizedDescription}

**अच्छे description की checklist:**
✅ Product की पूरी details
✅ Condition स्पष्ट रूप से बताएं
✅ Purchase date और warranty
✅ कोई defects हों तो ईमानदारी से बताएं
✅ क्यों बेच रहे हैं (optional but helpful)
✅ Delivery options
✅ Payment methods accepted
✅ Contact information

**Pro tip:** Bullet points का इस्तेमाल करें - ये पढ़ने में आसान होते हैं!`;
  }

  // Price query
  if (
    lowerMessage.includes('price') ||
    lowerMessage.includes('कीमत') ||
    lowerMessage.includes('value') ||
    lowerMessage.includes('pricing')
  ) {
    return `💰 **Pricing Strategy:**

**आपकी current price:** ${listingData.price || 'Not specified'}

**बेहतर pricing के tips:**

1. **Research करें:** Facebook Marketplace पर similar items की कीमत देखें
2. **Competitive रखें:** 5-10% कम रखें competition से
3. **Negotiation room:** List price में 10-15% negotiation का space रखें
4. **Psychology:** ₹50,000 की जगह ₹49,999 लिखें
5. **Bundle deals:** Related items को साथ बेचें

**Price के साथ mention करें:**
• "Slightly negotiable"
• "Fixed price" (अगर negotiate नहीं करना)
• "Best offer wins"
• Original price और discount percentage

क्या आप market research की मदद चाहते हैं?`;
  }

  // Photos query
  if (
    lowerMessage.includes('photo') ||
    lowerMessage.includes('image') ||
    lowerMessage.includes('picture') ||
    lowerMessage.includes('तस्वीर') ||
    lowerMessage.includes('फोटो')
  ) {
    return `📸 **Photos की Ultimate Guide:**

**कितने photos चाहिए:** कम से कम 5-8 photos

**ज़रूरी photos:**
1. ✅ Front view - clear और bright
2. ✅ Back view
3. ✅ Side views (दोनों तरफ से)
4. ✅ Close-up of important features
5. ✅ Serial number/Model sticker
6. ✅ Accessories (box, charger, etc.)
7. ✅ Size comparison (scale के लिए)
8. ✅ Any defects (ईमानदारी important है)

**Photo tips:**
• Natural daylight में खींचें
• Clean background (white/plain best है)
• सभी angles cover करें
• Blur या pixelated photos avoid करें
• Original photos use करें (internet से copy ना करें)
• Editing कम से कम - authenticity important है

**Pro tip:** Photos जितने professional, उतने ज्यादा serious buyers!`;
  }

  // Sales tips query
  if (
    lowerMessage.includes('sale') ||
    lowerMessage.includes('sell') ||
    lowerMessage.includes('बेचना') ||
    lowerMessage.includes('बिक्री') ||
    lowerMessage.includes('fast') ||
    lowerMessage.includes('जल्दी')
  ) {
    return `🚀 **जल्दी बेचने के proven tips:**

1. **Timing matters:**
   • Weekends पर post करें
   • Evening 6-9 PM best time है
   • महीने की शुरुआत में (लोगों के पास पैसे होते हैं)

2. **Response time:**
   • Messages का तुरंत जवाब दें
   • 1 घंटे के अंदर reply करें
   • Auto-reply set up करें अगर busy हों

3. **Listing को active रखें:**
   • Daily एक बार renew/refresh करें
   • Price में minor changes करें visibility के लिए
   • Peak hours में update करें

4. **Trust building:**
   • Profile complete रखें with real photo
   • Previous positive reviews share करें
   • Contact number verified रखें
   • Facebook से कई सालों से हों (trusted)

5. **Urgency create करें:**
   • "First come first serve" लिखें
   • "Only 2 days available" जैसे phrases
   • Multiple inquiries का mention करें

6. **Flexible बनें:**
   • Multiple payment options accept करें
   • Delivery या pickup - दोनों options दें
   • Meet in safe public places

क्या किसी specific tip के बारे में और जानना चाहते हैं?`;
  }

  // Safety query
  if (
    lowerMessage.includes('safe') ||
    lowerMessage.includes('scam') ||
    lowerMessage.includes('fraud') ||
    lowerMessage.includes('सुरक्षा') ||
    lowerMessage.includes('धोखा')
  ) {
    return `🛡️ **Safety Tips - बहुत ज़रूरी:**

**Buyer से मिलते समय:**
• Public place में मिलें (mall, café)
• Daylight में meet करें
• किसी को साथ ले जाएं
• Address share करने से पहले verify करें
• Home address ना दें initially

**Payment safety:**
• Cash preferred है face-to-face deals में
• UPI/Bank transfer - confirmation check करें
• Advance payment सिर्फ trusted buyers को
• COD (Cash on Delivery) best है
• Fake payment screenshots से सावधान रहें

**Red flags - इनसे बचें:**
🚩 बिना देखे advance payment मांगे
🚩 OTP share करने को कहें
🚩 Overly eager - बिना negotiate तैयार
🚩 Pickup के लिए address change करते रहें
🚩 Personal banking details मांगे

**Best practices:**
✅ Facebook profile verify करें
✅ Mutual friends check करें
✅ Phone number verified हो
✅ Profile new ना हो (minimum 6 months old)
✅ Previous marketplace activity check करें

Remember: अगर कुछ suspicious लगे, deal cancel कर दें!`;
  }

  // General improvement query
  if (
    lowerMessage.includes('improve') ||
    lowerMessage.includes('better') ||
    lowerMessage.includes('सुधार') ||
    lowerMessage.includes('बेहतर') ||
    lowerMessage.includes('how') ||
    lowerMessage.includes('कैसे')
  ) {
    return `💡 **आपकी listing को improve करने के लिए:**

**Priority improvements:**

${analysis.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

**और भी tips:**

🎯 **Content:**
• Storytelling करें - product का journey बताएं
• Benefits highlight करें, सिर्फ features नहीं
• Emotional connection बनाएं

🎨 **Presentation:**
• Consistent formatting use करें
• Bullet points readability बढ़ाते हैं
• Important info को bold करें
• Sections में divide करें

⚡ **Engagement:**
• Questions welcome करें
• Quick response time mention करें
• Similar items का bundle offer दें
• Testimonials add करें (अगर हों)

📊 **Performance tracking:**
• कितने views आ रहे हैं
• Messages की quality कैसी है
• 2-3 दिन में no response तो strategy change करें

क्या किसी specific area पर focus करना चाहते हैं?`;
  }

  // Competition query
  if (
    lowerMessage.includes('competition') ||
    lowerMessage.includes('competitor') ||
    lowerMessage.includes('other seller') ||
    lowerMessage.includes('प्रतियोगिता')
  ) {
    return `🎯 **Competition से आगे रहने के लिए:**

**Differentiation strategies:**

1. **Better presentation:**
   • Professional photos लें
   • Detailed description लिखें
   • Clear, honest communication

2. **Value additions:**
   • Free accessories include करें
   • Extended warranty offer करें
   • Free home delivery (local area)
   • Installation help (अगर applicable)

3. **Customer service:**
   • 24/7 available रहें (या timings clearly बताएं)
   • Polite और professional tone
   • After-sales support का mention करें

4. **Credibility building:**
   • Reviews screenshot share करें
   • Verified badges लें
   • Real photos with timestamp

5. **Smart pricing:**
   • Competitive research करें
   • Value for money highlight करें
   • Bundle deals create करें

**Research करें:**
• Similar products search करें
• उनकी pricing देखें
• उनकी weaknesses identify करें
• अपनी listing में better करें

**Your USP (Unique Selling Point) क्या है?**
इसे clearly communicate करें!`;
  }

  // Category-specific query
  if (lowerMessage.includes('category') || lowerMessage.includes('श्रेणी')) {
    return `📂 **Category Selection Tips:**

**आपकी category:** ${listingData.category || 'Not specified'}

**सही category क्यों important है:**
• Targeted buyers तक पहुंचता है
• Search results में better visibility
• Relevant recommendations में आता है

**Popular categories:**
1. 📱 Electronics & Gadgets - highest demand
2. 🚗 Vehicles - cars, bikes, scooters
3. 🏠 Home & Garden - furniture, appliances
4. 👕 Fashion - clothing, accessories
5. 📚 Books & Hobbies
6. 🎮 Gaming
7. 👶 Kids & Baby items

**Category-specific tips:**

**Electronics:**
• Model number ज़रूर दें
• Bill available है तो mention करें
• Warranty details

**Furniture:**
• Dimensions clearly दें
• Material specify करें
• Pickup arrangement clarify करें

**Fashion:**
• Size chart use करें
• Brand authenticity proof
• Condition very clearly बताएं

अपनी category के लिए specific tips चाहिए? पूछें!`;
  }

  // Generic helpful response
  const responses = [
    `मैं आपकी मदद के लिए हूँ! आप मुझसे पूछ सकते हैं:

• **Keywords** - कौन से tags use करें?
• **Title** - शीर्षक कैसे बेहतर बनाएं?
• **Description** - विवरण में क्या लिखें?
• **Pricing** - सही कीमत कैसे set करें?
• **Photos** - कैसी तस्वीरें लें?
• **Sales tips** - जल्दी कैसे बेचें?
• **Safety** - सुरक्षित कैसे रहें?

कुछ भी पूछें, मैं मदद करूंगा! 😊`,

    `अच्छा सवाल! ${listingData.title ? `आपकी "${listingData.title}" listing के लिए` : 'आपकी listing के लिए'} मैं ये suggest करूंगा:

**Quick wins:**
1. ${analysis.suggestions[0] || 'शीर्षक में keywords add करें'}
2. Clear, bright photos लें
3. Competitive pricing करें
4. Messages का तुरंत reply दें

**ज्यादा details चाहिए?** मुझसे specific topics के बारे में पूछें:
• Keywords और tags
• Title optimization
• Description writing
• Pricing strategy
• Photo tips
• या कोई और सवाल!`,

    `बिल्कुल, मैं आपकी मदद कर सकता हूँ!

**आपकी listing analysis:**
• Keywords: ${analysis.keywords.slice(0, 3).join(', ')} और ${analysis.keywords.length - 3} अन्य
• Category: ${listingData.category || 'General'}
• Price point: ${listingData.price || 'To be decided'}

**Next steps:**
1. मुझसे specific improvements के बारे में पूछें
2. मैं आपको detailed guidance दूंगा
3. Implement करें और results देखें!

क्या आप किसी specific area को improve करना चाहते हैं?`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
