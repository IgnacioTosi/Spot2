<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShortUrl;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;


/**
 * @OA\Info(
 *     title="Shortened URLs API",
 *     version="1.0.0",
 *     description="API for creating, listing, and managing shortened URLs"
 * )
 * 
 *  @OA\Tag(
 *     name="Endpoints",
 *    description="All API routes for shortened URLs"
 *  )
 * 
 * @OA\Schema(
 *     schema="ShortUrl",
 *     type="object",
 *     title="ShortUrl",
 *     description="Schema for a shortened URL",
 *     @OA\Property(
 *         property="id",
 *         type="integer",
 *         description="ID of the shortened URL"
 *     ),
 *     @OA\Property(
 *         property="short_code",
 *         type="string",
 *         description="Shortened code for the URL"
 *     ),
 *     @OA\Property(
 *         property="original_url",
 *         type="string",
 *         description="The original URL"
 *     ),
 *     @OA\Property(
 *         property="created_at",
 *         type="string",
 *         format="date-time",
 *         description="Timestamp of when the URL was created"
 *     ),
 *     @OA\Property(
 *         property="updated_at",
 *         type="string",
 *         format="date-time",
 *         description="Timestamp of when the URL was last updated"
 *     )
 * )
 */
class ShortUrlController extends Controller
{

    /**
     * @OA\Post(
     *     path="/api/shorten",
     *     summary="Create a shortened URL",
     *      tags={"Endpoints"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="original_url", type="string", description="The original URL to shorten")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="URL shortened successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="short_code", type="string", description="Generated short code")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Invalid URL"),
     * )
     */
    public function store(Request $request)
    {
        $request->validate(['original_url' => 'required|url']);

        // Generar un código único aleatorio
        do {
            $shortCode = Str::random(8);
        } while (ShortUrl::where('short_code', $shortCode)->exists());

        ShortUrl::create([
            'original_url' => $request->original_url,
            'short_code' => $shortCode
        ]);

        Cache::forget('short_urls');

        return response()->json(['short_code' => $shortCode], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/redirect/{short_code}",
     *     summary="Redirect to the original URL",
     *      tags={"Endpoints"},
     *     @OA\Parameter(
     *         name="short_code",
     *         in="path",
     *         required=true,
     *         description="Short code to redirect",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(response=302, description="Redirection to the original URL"),
     *     @OA\Response(response=404, description="Short code not found")
     * )
     */
    public function redirect($shortCode)
    {
        $shortUrl = ShortUrl::where('short_code', $shortCode)->firstOrFail();
        // return redirect($shortUrl->original_url);
        return response()->json(['original_url' => $shortUrl->original_url]);
    }

    /**
     * @OA\Get(
     *     path="/api/urls",
     *     summary="Get all shortened URLs",
     *     tags={"Endpoints"},
     *     @OA\Response(
     *         response=200,
     *         description="List of shortened URLs",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/ShortUrl"))
     *     )
     * )
     */
    public function index()
    {
        // Intentamos obtener los datos de la caché
        $urls = Cache::remember('short_urls', now()->addMinutes(10), function () {
            return ShortUrl::all();
        });

        return response()->json($urls);
    }

    /**
     * @OA\Delete(
     *     path="/api/urls/{id}",
     *     summary="Delete a shortened URL",
     *      tags={"Endpoints"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID of the URL to delete",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="URL deleted successfully"),
     *     @OA\Response(response=404, description="URL not found")
     * )
     */
    public function destroy($id)
    {
        $url = ShortUrl::findOrFail($id);
        $url->delete();
        Cache::forget('short_urls');
        return response()->json(['message' => 'URL deleted successfully']);
    }
}
