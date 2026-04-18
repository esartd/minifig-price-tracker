import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SUPPORTED_CURRENCIES } from '@/lib/currency-config';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currency, countryCode, region, currencySymbol, locale } = body;

    // Validate currency is supported
    const validCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === currency);
    if (!validCurrency) {
      return NextResponse.json(
        { error: 'Unsupported currency' },
        { status: 400 }
      );
    }

    // Update user preferences in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        preferredCurrency: currency,
        preferredCountryCode: countryCode,
        preferredRegion: region,
        currencySymbol: currencySymbol,
        locale: locale,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        currency: updatedUser.preferredCurrency,
        countryCode: updatedUser.preferredCountryCode,
        region: updatedUser.preferredRegion,
        currencySymbol: updatedUser.currencySymbol,
        locale: updatedUser.locale,
      },
    });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
