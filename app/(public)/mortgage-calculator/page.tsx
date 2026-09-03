import MortgageCalculator from '@/components/MortgageCalculator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortgage Calculator',
  description: 'Estimate your monthly mortgage payment for Toronto real estate. Adjust price, down payment, rate, and amortization.',
  alternates: { canonical: '/mortgage-calculator' },
}

export default function MortgageCalculatorPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Mortgage Calculator</h1>
        <p className="text-[color:var(--text-muted)] mt-2">
          Estimate your monthly payment based on Toronto market rates.
        </p>
      </div>
      <MortgageCalculator defaultPrice={900000} />

      <div className="mt-12 border-t border-[color:var(--border)] pt-10">
        <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Understanding your mortgage</h2>
        <div className="space-y-4 text-sm text-[color:var(--text-muted)] leading-relaxed">
          <p>
            In Canada, if your down payment is less than 20% of the purchase price, you must purchase mortgage
            default insurance (CMHC). The premium is added to your mortgage and ranges from 2.8% to 4% of the loan amount.
          </p>
          <p>
            Most Toronto buyers choose a 5-year fixed term with a 25-year amortization. As of 2025, insured
            mortgages allow up to 30-year amortization on new builds.
          </p>
          <p>
            Remember to budget for closing costs: land transfer tax (double in Toronto due to the city LTT),
            legal fees, title insurance, and moving expenses — typically 1.5–4% of purchase price.
          </p>
        </div>
      </div>
    </div>
  )
}
