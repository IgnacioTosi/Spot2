<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase; // Importa la trait
use App\Models\ShortUrl;

class ShortUrlIntegrationTest extends TestCase
{

    // Utiliza la trait RefreshDatabase para limpiar la base de datos antes de cada prueba
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_short_url()
    {

        $response = $this->postJson('/api/shorten', [
            'original_url' => 'https://example.com',
        ]);


        $response->assertStatus(201);


        $response->assertJsonStructure(['short_code']);


        $this->assertDatabaseHas('short_urls', [
            'original_url' => 'https://example.com',
            'short_code' => $response->json('short_code'),
        ]);
    }

    public function test_it_fetches_all_shortened_urls()
    {

        // Limpiar datos existentes
        ShortUrl::query()->delete();

        // Crear datos de prueba
        $urls = ShortUrl::factory()->count(3)->create();

        // Realizar solicitud GET
        $response = $this->getJson('/api/urls');

        // Verificar que el código HTTP sea 200
        $response->assertStatus(200);

        // Verificar que el JSON de respuesta contenga los datos esperados
        $response->assertJsonCount(3) // Número de URLs en la respuesta
            ->assertJsonFragment([
                'short_code' => $urls[0]->short_code,
                'original_url' => $urls[0]->original_url,
            ]);
    }

    public function test_it_returns_empty_list_if_no_urls_exist()
    {

        // Limpiar la base de datos antes del test
        ShortUrl::query()->delete();

        // Realizar solicitud GET
        $response = $this->getJson('/api/urls');

        // Verificar que el código HTTP sea 200 y la respuesta sea una lista vacía
        $response->assertStatus(200)
            ->assertExactJson([]);
    }

    public function test_it_deletes_a_shortened_url()
    {
        // Crear datos de prueba
        $url = ShortUrl::factory()->create();

        // Realizar solicitud DELETE
        $response = $this->deleteJson("/api/urls/{$url->id}");

        // Verificar que el código HTTP sea 200
        $response->assertStatus(200);

        // Verificar que la URL haya sido eliminada
        $this->assertDatabaseMissing('short_urls', [
            'id' => $url->id,
        ]);
    }

    public function test_it_returns_404_if_url_not_found()
    {
        // Realizar solicitud DELETE para un ID inexistente
        $response = $this->deleteJson('/api/urls/999');

        // Verificar que el código HTTP sea 404
        $response->assertStatus(404);
    }

    /** @test */
    public function it_redirects_to_the_original_url()
    {
        $shortUrl = ShortUrl::factory()->create([
            'original_url' => 'https://example.com',
        ]);

        $response = $this->get('/api/redirect/' . $shortUrl->short_code);

        $response->assertStatus(200);
        $response->assertJson([
            'original_url' => 'https://example.com',
        ]);
    }
}
