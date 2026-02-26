import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const hcaptchaSecretKey = process.env.HCAPTCHA_SECRET_KEY
const edgeFunctionUrl = process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_URL

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)


async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `response=${token}&secret=${hcaptchaSecretKey}`,
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('[v0] CAPTCHA verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipeName, description, ingredients, email, name, captchaToken } = body

    
    if (!recipeName?.trim() || !email?.trim() || !name?.trim() || !captchaToken) {
      return NextResponse.json(
        { error: 'Missing required fields or CAPTCHA token' },
        { status: 400 }
      )
    }

    
    const isCaptchaValid = await verifyCaptcha(captchaToken)
    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      )
    }

    
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'


    const oneHourAgo = new Date(Date.now() - 3600000)
    const { data: recentRequests, error: queryError } = await supabase
      .from('recipe_requests')
      .select('id', { count: 'exact' })
      .eq('client_ip', clientIp)
      .gt('created_at', oneHourAgo.toISOString())

    if (queryError) {
      console.error('[v0] Database query error:', queryError)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    if ((recentRequests?.length || 0) >= 3) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 3 requests per hour.' },
        { status: 429 }
      )
    }

    
    const { data: insertedRequest, error: insertError } = await supabase
      .from('recipe_requests')
      .insert({
        recipe_name: recipeName,
        description: description || null,
        ingredients: ingredients || null,
        email: email,
        name: name,
        client_ip: clientIp,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('[v0] Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to save recipe request' },
        { status: 500 }
      )
    }

    
    if (edgeFunctionUrl) {
      try {
        const emailResponse = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipeName,
            description,
            ingredients,
            email,
            name,
            requestId: insertedRequest.id,
          }),
        })

        if (!emailResponse.ok) {
          console.error('[v0] Edge Function error:', await emailResponse.text())
        }
      } catch (error) {
        console.error('[v0] Error calling Edge Function:', error)
        
      }
    }

    return NextResponse.json(
      { 
        message: 'Recipe request submitted successfully',
        requestId: insertedRequest.id 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
